package com.finance.tracker.controller;

import org.springframework.web.bind.annotation.*;
import com.finance.tracker.model.Group;
import com.finance.tracker.service.GroupService;
import com.finance.tracker.dto.GroupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;
import com.finance.tracker.model.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor // Inject dependencies via constructor
public class GroupController {

    private final GroupService groupService;

    //1. Create a new group
    @PostMapping
    public ResponseEntity<Group> createGroup(
        @RequestBody GroupRequest request,
        @AuthenticationPrincipal User user // Logged-in user
    ){
        return ResponseEntity.ok(groupService.createGroup(request, user));
    }

    // Find the groups for a user
    @GetMapping
    public ResponseEntity<List<Group>> getMyGroups(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(groupService.getMyGroups(user));
    }

    // Get a specific group by ID
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(groupService.getGroupById(id, user));
    }

    // Get group members
    @GetMapping("/{id}/members")
    public ResponseEntity<?> getGroupMembers(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(groupService.getGroupMembers(id, user));
    }

    // Get group transactions
    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<com.finance.tracker.model.Transaction>> getGroupTransactions(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(groupService.getGroupTransactions(id, user));
    }
}
