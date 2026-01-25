package com.finance.tracker.dto;

import com.finance.tracker.model.enums.TransactionType;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;  //"Food", "Salary", etc.
    private TransactionType type; //INCOME, EXPENSE, TRANSFER

}
