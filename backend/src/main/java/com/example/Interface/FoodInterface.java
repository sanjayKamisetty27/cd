package com.example.Interface;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.Model.Food;

public interface FoodInterface extends JpaRepository<Food, Long> { // Updated primary key type to Long

    // Find a food item by its name
    Food findByName(String name);

    // Custom query to find foods containing a specific name (case insensitive)
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Food> findByNameIgnoreCase(@Param("name") String name);

    // Find foods with protein greater than or equal to a specified value
    List<Food> findByProteinGreaterThanEqual(double protein);

    // Find foods with fat greater than or equal to a specified value
    List<Food> findByFatGreaterThanEqual(double fat);

    // Find foods with net carbs greater than or equal to a specified value
    List<Food> findByNetCarbsGreaterThanEqual(double carbs);

    // Find foods with energy greater than or equal to a specified value
    List<Food> findByEnergyGreaterThanEqual(double energy);

    // Find a food item by its ID (optional since JpaRepository already provides it)
    @Override
    Optional<Food> findById(@Param("id") Long id); // Explicit declaration for clarity
}

