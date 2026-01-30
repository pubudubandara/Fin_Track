package com.finance.tracker.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Collection;
import java.util.List;

@Data // Lombok annotation to generate getters, setters, toString, etc.
@Builder // Lombok annotation to implement the builder pattern
@NoArgsConstructor // JPA needs an empty constructor
@AllArgsConstructor // Constructor with all fields
@Entity // Map this to the database table
@Table(name = "users") // Specify the table name

public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate the ID value
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Username is mandatory")
    @JsonProperty("username")
    private String username;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // ---UserDetails interface methods implementation---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Override
    public String getUsername() {
        return email; // Use email as the username for authentication
    }

    // Custom method to get the actual username field (not the email)
    @JsonProperty("username")
    public String getName() {
        return username;
    }

}
