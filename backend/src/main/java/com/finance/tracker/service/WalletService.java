package com.finance.tracker.service;

import org.springframework.stereotype.Service;

import com.finance.tracker.model.Wallet;
import com.finance.tracker.repository.WalletRepository;
import com.finance.tracker.dto.WalletRequest;
import com.finance.tracker.model.User;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor  // For dependency injection
public class WalletService {

    private final WalletRepository walletRepository;

    // 1. get all the wallets for a user
    public List<Wallet>getWallets(User user){
        return walletRepository.findAllByUser(user);
    }

    // 2. create a new wallet
    public Wallet createWallet(WalletRequest request, User user){
        var wallet = Wallet.builder()
                .name(request.getName())
                .balance(request.getBalance())
                .currency(request.getCurrency())
                .user(user)  // associate wallet with user
                .build();  // build wallet object

        return walletRepository.save(wallet);
    }

}
