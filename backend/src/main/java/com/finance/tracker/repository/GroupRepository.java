package com.finance.tracker.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.finance.tracker.model.Group;
import com.finance.tracker.model.User;

public interface GroupRepository extends JpaRepository<Group, Long> {

    //Magic Query to find groups by member user
    List<Group> findAllByMembersContaining(User user);
}
