package com.finance.tracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //handles the web requests ,convert return values to JSON
public class HealthController {

    @GetMapping("/") //Handles the get requests
    public String checkHealth(){
        return "Finance Tracker is running!";
    }

}
