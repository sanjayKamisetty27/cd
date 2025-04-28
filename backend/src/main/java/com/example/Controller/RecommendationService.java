package com.example.Controller;

import com.example.Model.Recommendation;
import com.example.Interface.RecommendationInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/recommendation")
@CrossOrigin(origins = "http://localhost:3001")
public class RecommendationService {

    @Autowired
    private RecommendationInterface recommendationRepository;

    // Asynchronous method to add a recommendation
    @PostMapping
    @Async
    public CompletableFuture<ResponseEntity<?>> addRecommendation(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam MultipartFile image,
            @RequestParam double energy,
            @RequestParam double protein,
            @RequestParam double fat,
            @RequestParam double netCarbs,
            @RequestParam String cookingSteps,
            @RequestParam String nutritionalLevel) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                byte[] imageBytes = image.getBytes();

                // Create and save the recommendation
                Recommendation recommendation = new Recommendation();
                recommendation.setName(name);
                recommendation.setDescription(description);
                recommendation.setImage(imageBytes);
                recommendation.setEnergy(energy);
                recommendation.setProtein(protein);
                recommendation.setFat(fat);
                recommendation.setNetCarbs(netCarbs);
                recommendation.setCookingSteps(cookingSteps);
                recommendation.setNutritionalLevel(nutritionalLevel);

                Recommendation savedRecommendation = recommendationRepository.save(recommendation);
                return ResponseEntity.ok(savedRecommendation);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error saving recommendation: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to edit a recommendation by ID
    @PutMapping("/{id}")
    @Async
    public CompletableFuture<ResponseEntity<?>> editRecommendation(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) Double energy,
            @RequestParam(required = false) Double protein,
            @RequestParam(required = false) Double fat,
            @RequestParam(required = false) Double netCarbs,
            @RequestParam(required = false) String cookingSteps,
            @RequestParam(required = false) String nutritionalLevel) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                // Fetch the recommendation by ID
                Optional<Recommendation> optionalRecommendation = recommendationRepository.findById(id);
                if (optionalRecommendation.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recommendation not found");
                }

                Recommendation recommendation = optionalRecommendation.get();

                // Update optional fields if provided
                if (name != null && !name.isEmpty()) {
                    recommendation.setName(name);
                }
                if (description != null && !description.isEmpty()) {
                    recommendation.setDescription(description);
                }
                if (image != null && !image.isEmpty()) {
                    recommendation.setImage(image.getBytes());
                }
                if (energy != null) {
                    recommendation.setEnergy(energy);
                }
                if (protein != null) {
                    recommendation.setProtein(protein);
                }
                if (fat != null) {
                    recommendation.setFat(fat);
                }
                if (netCarbs != null) {
                    recommendation.setNetCarbs(netCarbs);
                }
                if (cookingSteps != null && !cookingSteps.isEmpty()) {
                    recommendation.setCookingSteps(cookingSteps);
                }
                if (nutritionalLevel != null && !nutritionalLevel.isEmpty()) {
                    recommendation.setNutritionalLevel(nutritionalLevel);
                }

                // Save the updated entity
                Recommendation updatedRecommendation = recommendationRepository.save(recommendation);
                return ResponseEntity.ok(updatedRecommendation);

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error updating recommendation: " + e.getMessage());
            }
        });
    }

 // Asynchronous method to get all recommendations or filter by nutritional level
    @GetMapping("/all")
    @Async
    public CompletableFuture<ResponseEntity<?>> getRecommendations(
            @RequestParam(value = "nutritionalLevel", required = false) String nutritionalLevel) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Recommendation> recommendationList;
                
                // Check if nutritionalLevel is provided
                if (nutritionalLevel != null && !nutritionalLevel.isEmpty()) {
                    recommendationList = recommendationRepository.findByNutritionalLevel(nutritionalLevel);
                    if (recommendationList.isEmpty()) {
                        return ResponseEntity.status(404).body("No recommendations found for nutritional level: " + nutritionalLevel);
                    }
                } else {
                    recommendationList = recommendationRepository.findAll();
                    if (recommendationList.isEmpty()) {
                        return ResponseEntity.status(404).body("No recommendations found");
                    }
                }
                
                return ResponseEntity.ok(recommendationList);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving recommendations: " + e.getMessage());
            }
        });
    }



    // Asynchronous method to delete a recommendation by ID
    @DeleteMapping("/{id}")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteRecommendation(@PathVariable Long id) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Optional<Recommendation> optionalRecommendation = recommendationRepository.findById(id);
                if (optionalRecommendation.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recommendation not found");
                }

                recommendationRepository.delete(optionalRecommendation.get());
                return ResponseEntity.ok("Recommendation deleted successfully");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error deleting recommendation: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to get a recommendation's image
    @GetMapping("/{name}/image")
    @Async
    public CompletableFuture<ResponseEntity<?>> getRecommendationImage(@PathVariable String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Recommendation recommendation = recommendationRepository.findByName(name);
                if (recommendation == null) {
                    return ResponseEntity.status(404).body("Recommendation not found");
                }

                byte[] imageBytes = recommendation.getImage();
                String contentType = "image/jpeg";

                if (imageBytes.length > 1) {
                    if (imageBytes[0] == (byte) 0x89 && imageBytes[1] == (byte) 0x50) {
                        contentType = "image/png";
                    } else if (imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
                        contentType = "image/jpeg";
                    }
                }

                HttpHeaders headers = new HttpHeaders();
                headers.set("Content-Type", contentType);
                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving recommendation image: " + e.getMessage());
            }
        });
    }
}
