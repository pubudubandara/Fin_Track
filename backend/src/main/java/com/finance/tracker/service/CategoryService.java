package com.finance.tracker.service;

import com.finance.tracker.model.Category;
import com.finance.tracker.repository.CategoryRepository;
import com.finance.tracker.dto.CategoryRequest;
import com.finance.tracker.model.User;
import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    //1. get all the categories
    public List<Category> getAllCategories(User user){
        return categoryRepository.findByUserIsNullOrUser(user);
    }

    //2. create a new category
    public Category createCategory(CategoryRequest request, User user){
        var category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .user(user)  // associate category with user
                .build();  // build category object

        return categoryRepository.save(category);
    }

}
