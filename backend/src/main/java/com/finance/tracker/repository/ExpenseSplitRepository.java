package com.finance.tracker.repository;

import com.finance.tracker.model.ExpenseSplit;
import com.finance.tracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    //The lists below are for the dashboard "Splits" section (for me)
    // SELECT * FROM splits WHERE transaction.user_id = ME AND split.user_id != ME
    @Query("SELECT es FROM ExpenseSplit es WHERE es.transaction.user.id = :userId AND es.user.id != :userId")
    List<ExpenseSplit> findWhoOwesMe(Long userId);

    // The lists below are for the dashboard "Splits" section ( My Liabilities)
    // SELECT * FROM splits WHERE transaction.user_id != ME AND split.user_id = ME
    @Query("SELECT es FROM ExpenseSplit es WHERE es.transaction.user.id != :userId AND es.user.id = :userId")
    List<ExpenseSplit> findWhomIOwe(Long userId);
    
    // Find all expense splits for a specific transaction
    List<ExpenseSplit> findAllByTransaction(Transaction transaction);
}