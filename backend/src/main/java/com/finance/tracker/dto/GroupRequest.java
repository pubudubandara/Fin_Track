package com.finance.tracker.dto;

import lombok.Data;
import java.util.Set;

@Data
public class GroupRequest {
    private String name;
    private String description;
    private Set<Long> memberIds; // IDs of users to be added as members
}
