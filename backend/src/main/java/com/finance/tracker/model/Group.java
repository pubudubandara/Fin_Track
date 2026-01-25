package com.finance.tracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;


@Data
@Builder // Lombok annotation to generate getters, setters, toString, etc.
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor
@AllArgsConstructor // Lombok annotation to generate an all-argument constructor
@Entity
@Table(name = "expence_groups") // Don't use groups as table name because it's a reserved keyword in SQL
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    //----Many to Many relaionship-----

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name="group_members", // middle table name
        joinColumns = @JoinColumn(name="group_id"), // foreign key column for this entity
        inverseJoinColumns = @JoinColumn(name="user_id") // foreign key column for the
    )

    //we use set to avoid duplicate members
    private Set<User> members = new HashSet<>();

    //Who created the group (Admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

}
