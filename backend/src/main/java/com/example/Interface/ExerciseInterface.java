package com.example.Interface;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.Model.Exercise;

public interface ExerciseInterface extends JpaRepository<Exercise, Long> { // Updated primary key type to Long

    // Find an exercise by its name
    Exercise findByName(String name);

    // Find exercises by name (case-insensitive) with partial matching
    @Query("SELECT e FROM Exercise e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Exercise> findByNameIgnoreCase(@Param("name") String name);

    // Explicitly declare findById for clarity (optional)
    @Override
    Optional<Exercise> findById(@Param("id") Long id); // Find exercise by ID
}
