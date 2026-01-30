package com.finance.tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.finance.tracker.service.WalletService;
import lombok.RequiredArgsConstructor;
import com.finance.tracker.model.Wallet;
import com.finance.tracker.model.User;
import java.util.List;
import com.finance.tracker.dto.WalletRequest;


@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor  // Inject dependencies via constructor
public class WalletController {

    private final WalletService walletService;

    //1.get the wallets for a user
    @GetMapping
    public ResponseEntity<List<Wallet>> getWallets(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(walletService.getWallets(user));
    }

    //2. create a new wallet
    @PostMapping
    public ResponseEntity<Wallet> createWallet(
        @RequestBody WalletRequest request,
        @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(walletService.createWallet(request, user));
    }
}
