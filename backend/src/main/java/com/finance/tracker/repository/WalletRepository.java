package com.finance.tracker.repository;
import com.finance.tracker.model.Wallet;
import com.finance.tracker.model.User;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findAllByUser(User userId);

}
