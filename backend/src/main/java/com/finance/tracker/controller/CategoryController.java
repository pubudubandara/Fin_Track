package com.finance.tracker.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.finance.tracker.model.User;
import com.finance.tracker.model.Category;
import com.finance.tracker.service.CategoryService;
import com.finance.tracker.dto.CategoryRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    //1. get the categories for a user
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(categoryService.getAllCategories(user));
    }

    //2. Create a new category
    @PostMapping
    public ResponseEntity<Category> createCategory(
        @RequestBody CategoryRequest request,
        @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(categoryService.createCategory(request, user));
    }
}
