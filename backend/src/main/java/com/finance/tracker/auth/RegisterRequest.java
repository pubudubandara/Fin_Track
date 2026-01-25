package com.finance.tracker.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data //Lombok annotation to generate getters, setters, toString, etc.
@Builder //Lombok annotation to implement the builder pattern
@AllArgsConstructor //Constructor with all fields
@NoArgsConstructor //JPA needs an empty constructor
public class RegisterRequest {

    private String username;
    private String email;
    private String password;
}
