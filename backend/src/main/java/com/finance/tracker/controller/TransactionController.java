package com.finance.tracker.controller;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody TransactionRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(service.createTransaction(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getMyTransactions(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        service.deleteTransaction(id, user);
        return ResponseEntity.noContent().build();
    }
}