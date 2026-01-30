package com.finance.tracker.service;

import org.springframework.stereotype.Service;
import com.finance.tracker.dto.GroupRequest;
import com.finance.tracker.dto.UserDTO;
import com.finance.tracker.model.Group;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.GroupRepository;
import com.finance.tracker.repository.UserRepository;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // Lombok annotation to generate constructor with required arguments
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final com.finance.tracker.repository.TransactionRepository transactionRepository;

    //1.create a new group
    public Group createGroup(GroupRequest request, User creator){

        // find the friends by their IDs
        Set<User> members = new HashSet<>();

        // Add the creator to the members set
        members.add(creator);

        // Find the users by their IDs and add to members set
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            List<User> foundUsers = userRepository.findAllById(request.getMemberIds());
            members.addAll(foundUsers);
        }

        // Create the group and save
        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(creator) // Admin
                .members(members)   // Set of members
                .build();

        return groupRepository.save(group);
    }

    // 2. get groups for a user
    public List<Group> getMyGroups(User user) {
        return groupRepository.findAllByMembersContaining(user);
    }

    // 3. Get group by ID
    public Group getGroupById(Long groupId, User user) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Security check: Ensure user is a member of the group
        if (!group.getMembers().contains(user)) {
            throw new RuntimeException("Access denied: You are not a member of this group");
        }
        
        return group;
    }

    // 4. Get group members
    public List<UserDTO> getGroupMembers(Long groupId, User user) {
        Group group = getGroupById(groupId, user); // Reuse security check
        return group.getMembers().stream()
            .map(member -> UserDTO.builder()
                .id(member.getId())
                .username(member.getName())
                .email(member.getEmail())
                .build())
            .collect(Collectors.toList());
    }

    // 5. Get group transactions
    public List<com.finance.tracker.model.Transaction> getGroupTransactions(Long groupId, User user) {
        Group group = getGroupById(groupId, user); // Reuse security check
        return transactionRepository.findAllByGroupOrderByDateDesc(group);
    }
}