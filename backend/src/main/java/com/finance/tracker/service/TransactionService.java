package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.model.*;
import com.finance.tracker.model.enums.TransactionType;
import com.finance.tracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final CategoryRepository categoryRepository;
    private final GroupRepository groupRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final UserRepository userRepository;

    /**
     * Create a new transaction.
     * This handles:
     * 1. Updating the wallet balance.
     * 2. Linking the transaction to a Group (optional).
     * 3. Creating expense splits among friends (optional).
     */
    @Transactional // Ensures data consistency. If any step fails, everything rolls back.
    public Transaction createTransaction(TransactionRequest request, User user) {

        // 1. Validate and Retrieve Wallet
        Wallet wallet = walletRepository.findById(request.getWalletId())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // Security Check: Ensure the wallet belongs to the authenticated user
        if (!wallet.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this wallet");
        }

        // 2. Retrieve Category
        var category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 3. Update Wallet Balance (Business Logic)
        if (request.getType() == TransactionType.EXPENSE) {
            // Check for sufficient funds
            if (wallet.getBalance() < request.getAmount()) {
                throw new RuntimeException("Insufficient balance in wallet!");
            }
            wallet.setBalance(wallet.getBalance() - request.getAmount());
        } else if (request.getType() == TransactionType.INCOME) {
            wallet.setBalance(wallet.getBalance() + request.getAmount());
        }
        
        // Save the updated wallet balance
        walletRepository.save(wallet);

        // 4. Handle Group Logic (Optional)
        Group group = null;
        if (request.getGroupId() != null) {
            group = groupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
        }

        // 5. Create and Save the Transaction Entity
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .type(request.getType())
                .user(user)
                .wallet(wallet)
                .category(category)
                .group(group) // Can be null if not a group expense
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        // 6. Handle Expense Splitting (The "Splitwise" Logic) 🚀
        // Only executes if a Group is selected AND splitUserIds are provided
        if (group != null && request.getSplitUserIds() != null && !request.getSplitUserIds().isEmpty()) {
            
            List<Long> userIdsToSplit = request.getSplitUserIds();
            
            // Logic: Equal Split
            // Formula: Total Amount / Number of people
            double splitAmount = request.getAmount() / userIdsToSplit.size();

            for (Long splitUserId : userIdsToSplit) {
                // Find the friend/user
                User splitUser = userRepository.findById(splitUserId)
                        .orElseThrow(() -> new RuntimeException("User to split with not found: ID " + splitUserId));
                
                // Create the debt record
                ExpenseSplit split = ExpenseSplit.builder()
                        .transaction(savedTransaction) // Link to the main bill
                        .user(splitUser)               // Who owes/participated
                        .amount(splitAmount)           // Their share
                        .build();

                expenseSplitRepository.save(split);
            }
        }

        return savedTransaction;
    }

    /**
     * Retrieve all transactions for a specific user, ordered by date (newest first).
     */
    public List<Transaction> getMyTransactions(User user) {
        return transactionRepository.findAllByUserOrderByDateDesc(user);
    }
}