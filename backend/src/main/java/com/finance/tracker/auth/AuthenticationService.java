package com.finance.tracker.auth;

import com.finance.tracker.config.JwtService;
import com.finance.tracker.model.Role;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // 1. Register Method (Register a new user - Signup)
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) 
                .role(Role.USER)
                .build();
        
        repository.save(user); // save to the database
        
        var jwtToken = jwtService.generateToken(user); // generate the token
        return AuthenticationResponse.builder()
                .token(jwtToken) // return the token
                .build();
    }

    // 2. Authenticate Method (Login an existing user)
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // check whether username and password are correct
        // If incorrect, an error is thrown here (403 Forbidden).
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // If we reach here, the login is successful. Now we fetch the user.
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        
        // Generate a new token for the user.
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}