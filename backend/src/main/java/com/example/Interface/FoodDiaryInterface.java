package com.example.Interface;

import com.example.Model.FoodDairy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodDiaryInterface extends JpaRepository<FoodDairy, Long> {

    // Retrieve entries for a specific user on a specific date
    List<FoodDairy> findByEmailAndDate(String email, LocalDate date);

    // Retrieve all entries for a specific user
    List<FoodDairy> findByEmail(String email);
}

