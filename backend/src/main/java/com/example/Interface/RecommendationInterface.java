package com.example.Interface;

import com.example.Model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationInterface extends JpaRepository<Recommendation, Long> {

    // Find a recommendation by exact name match
    Recommendation findByName(String name);
    List<Recommendation> findByNutritionalLevel(String nutritionalLevel);
}
