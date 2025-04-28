package com.example.Interface;

import com.example.Model.ExerciseDiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExerciseDiaryInterface extends JpaRepository<ExerciseDiary, Long> {

    // Retrieve entries for a specific user on a specific date
    List<ExerciseDiary> findByEmailAndDate(String email, LocalDate date);

    // Retrieve all entries for a specific user
    List<ExerciseDiary> findByEmail(String email);
}
