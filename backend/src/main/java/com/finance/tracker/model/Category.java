package com.finance.tracker.model;

import com.finance.tracker.model.enums.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //for getters and setters
@Builder //for builder pattern
@NoArgsConstructor //for no-args constructor
@AllArgsConstructor //for all-args constructor
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    //Relationship 
    //if the user is null , visible for the all users 
    //if user exists , visible for the specific user
    // lazy only give the relevent data when we call it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
