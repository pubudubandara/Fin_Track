package com.finance.tracker.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByUserOrderByDateDesc(User user);
    List<Transaction> findAllByGroupOrderByDateDesc(com.finance.tracker.model.Group group);
}
