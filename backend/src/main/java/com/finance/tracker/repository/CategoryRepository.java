package com.finance.tracker.repository;

import com.finance.tracker.model.Category;
import com.finance.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Magic method to get Categories for a specific User
    // User can be null (public categories) or a specific user
    List<Category> findByUserIsNullOrUser(User user);
}