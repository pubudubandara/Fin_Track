package com.finance.tracker.dto;

import lombok.Data;
import java.time.LocalDate;
import com.finance.tracker.model.enums.TransactionType;
import java.util.List;

@Data
public class TransactionRequest {
    private Double amount;
    private String description;
    private LocalDate date;
    private TransactionType type;
    private Long walletId;
    private Long categoryId;
    private Long groupId;         
    private List<Long> splitUserIds;
}
