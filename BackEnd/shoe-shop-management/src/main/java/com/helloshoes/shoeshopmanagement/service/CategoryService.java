package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.CategoryDTO;

public interface CategoryService extends SuperService<CategoryDTO> {
    CategoryDTO getCategoryByName(String categoryName);

    String getNextCategoryCode();
}
