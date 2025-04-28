package com.example.Controller;

import com.example.Model.Exercise;
import com.example.Interface.ExerciseInterface;
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
@RequestMapping("/exercise")
@CrossOrigin(origins = "http://localhost:3001")
public class ExerciseService {

    @Autowired
    private ExerciseInterface exerciseRepository;

    // Asynchronous method to add exercise
    @PostMapping
    @Async
    public CompletableFuture<ResponseEntity<?>> addExercise(@RequestParam String name,
                                                            @RequestParam MultipartFile image,
                                                            @RequestParam double energy,
                                                            @RequestParam double protein,
                                                            @RequestParam double fat,
                                                            @RequestParam double netCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                byte[] imageBytes = image.getBytes();

                // Create and save exercise
                Exercise exercise = new Exercise();
                exercise.setName(name);
                exercise.setImage(imageBytes);
                exercise.setEnergy(energy);
                exercise.setProtein(protein);
                exercise.setFat(fat);
                exercise.setNetCarbs(netCarbs);

                Exercise savedExercise = exerciseRepository.save(exercise);
                return ResponseEntity.ok(savedExercise);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error saving exercise: " + e.getMessage());
            }
        });
    }

 // Asynchronous method to edit exercise
    @PutMapping("/{id}")
    @Async
    public CompletableFuture<ResponseEntity<?>> editExercise(
            @PathVariable Long id,
            @RequestParam(required = false) String name, // New parameter for name
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) Double energy,
            @RequestParam(required = false) Double protein,
            @RequestParam(required = false) Double fat,
            @RequestParam(required = false) Double netCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Fetch the exercise by ID
                Optional<Exercise> optionalExercise = exerciseRepository.findById(id);
                if (optionalExercise.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise not found");
                }

                Exercise exercise = optionalExercise.get();

                // Update optional fields if provided
                if (name != null && !name.isBlank()) {
                    exercise.setName(name); // Update name
                }
                if (image != null && !image.isEmpty()) {
                    exercise.setImage(image.getBytes());
                }
                if (energy != null) {
                    exercise.setEnergy(energy);
                }
                if (protein != null) {
                    exercise.setProtein(protein);
                }
                if (fat != null) {
                    exercise.setFat(fat);
                }
                if (netCarbs != null) {
                    exercise.setNetCarbs(netCarbs);
                }

                // Save the updated entity
                Exercise updatedExercise = exerciseRepository.save(exercise);
                return ResponseEntity.ok(updatedExercise);

            } catch (Exception e) {
                e.printStackTrace(); // Log the error for debugging
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Error updating exercise: " + e.getMessage());
            }
        });
    }


    // Asynchronous method to get all exercises
    @GetMapping("/all")
    @Async
    public CompletableFuture<ResponseEntity<?>> getAllExercises() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Exercise> exerciseList = exerciseRepository.findAll();
                if (exerciseList.isEmpty()) {
                    return ResponseEntity.status(404).body("No exercises found");
                }
                return ResponseEntity.ok(exerciseList);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving exercises: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to get exercise image
    @GetMapping("/{name}/image")
    @Async
    public CompletableFuture<ResponseEntity<?>> getExerciseImage(@PathVariable String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Exercise exercise = exerciseRepository.findByName(name);
                if (exercise == null) {
                    return ResponseEntity.status(404).body("Exercise not found");
                }

                byte[] imageBytes = exercise.getImage();
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
                return ResponseEntity.status(500).body("Error retrieving exercise image: " + e.getMessage());
            }
        });
    }

 // Asynchronous method to delete an exercise by ID
    @DeleteMapping("/{id}")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteExercise(@PathVariable Long id) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Fetch the exercise by ID
                Optional<Exercise> optionalExercise = exerciseRepository.findById(id);
                if (optionalExercise.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exercise not found");
                }

                // Delete the exercise
                exerciseRepository.delete(optionalExercise.get());
                return ResponseEntity.status(HttpStatus.OK).body("Exercise deleted successfully");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Error deleting exercise: " + e.getMessage());
            }
        });
    }


    // Asynchronous method to search for an exercise by name
    @GetMapping("/search")
    @Async
    public CompletableFuture<ResponseEntity<?>> searchExerciseByName(@RequestParam String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Use the case-insensitive method from the repository
                List<Exercise> exercises = exerciseRepository.findByNameIgnoreCase(name);

                if (exercises.isEmpty()) {
                    return ResponseEntity.status(404).body("No exercises found matching the search query");
                }

                return ResponseEntity.ok(exercises);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error searching for exercises: " + e.getMessage());
            }
        });
    }
}
