package com.finance.tracker.dto;

import lombok.Data;

@Data
public class WalletRequest {
    private String name;
    private Double balance;
    private String currency;
}
