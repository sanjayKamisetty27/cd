package com.example.Controller;

import com.example.Model.Food;
import com.example.Interface.FoodInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/food")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodService {

    @Autowired
    private FoodInterface foodRepository;

    // Asynchronous method to add food item
    @PostMapping
    @Async
    public CompletableFuture<ResponseEntity<?>> addFood(@RequestParam String name,
                                                        @RequestParam String description,
                                                        @RequestParam MultipartFile image,
                                                        @RequestParam double energy,
                                                        @RequestParam double protein,
                                                        @RequestParam double fat,
                                                        @RequestParam double netCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                byte[] imageBytes = image.getBytes();

                // Create and save food item
                Food food = new Food();
                food.setName(name);
                food.setDescription(description);
                food.setImage(imageBytes);
                food.setEnergy(energy);
                food.setProtein(protein);
                food.setFat(fat);
                food.setNetCarbs(netCarbs);

                Food savedFood = foodRepository.save(food);
                return ResponseEntity.ok(savedFood);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error saving food item: " + e.getMessage());
            }
        });
    }
    
    //edit
 // Asynchronous method to edit a food item by ID
    @PutMapping("/{id}")
    @Async
    public CompletableFuture<ResponseEntity<?>> editFood(@PathVariable Long id,
                                                         @RequestParam(required = false) String name,
                                                         @RequestParam(required = false) String description,
                                                         @RequestParam(required = false) MultipartFile image,
                                                         @RequestParam(required = false) Double energy,
                                                         @RequestParam(required = false) Double protein,
                                                         @RequestParam(required = false) Double fat,
                                                         @RequestParam(required = false) Double netCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Fetch the food item by ID
                Optional<Food> optionalFood = foodRepository.findById(id);
                if (optionalFood.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Food item not found");
                }

                Food food = optionalFood.get();

                // Update optional fields if provided
                if (name != null && !name.isEmpty()) {
                    food.setName(name);  // Allow updating the name
                }
                if (description != null && !description.isEmpty()) {
                    food.setDescription(description);
                }
                if (image != null && !image.isEmpty()) {
                    food.setImage(image.getBytes());
                }
                if (energy != null) {
                    food.setEnergy(energy);
                }
                if (protein != null) {
                    food.setProtein(protein);
                }
                if (fat != null) {
                    food.setFat(fat);
                }
                if (netCarbs != null) {
                    food.setNetCarbs(netCarbs);
                }

                // Save the updated entity
                Food updatedFood = foodRepository.save(food);
                return ResponseEntity.ok(updatedFood);

            } catch (Exception e) {
                e.printStackTrace(); // Log the error for debugging
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Error updating food item: " + e.getMessage());
            }
        });
    }


    // Asynchronous method to get all food items
    @GetMapping("/all")
    @Async
    public CompletableFuture<ResponseEntity<?>> getAllFoodItems() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> foodList = foodRepository.findAll();
                if (foodList.isEmpty()) {
                    return ResponseEntity.status(404).body("No food items found");
                }
                return ResponseEntity.ok(foodList);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error retrieving food items: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to get food image
    @GetMapping("/{name}/image")
    @Async
    public CompletableFuture<ResponseEntity<?>> getFoodImage(@PathVariable String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Food food = foodRepository.findByName(name);
                if (food == null) {
                    return ResponseEntity.status(404).body("Food item not found");
                }

                byte[] imageBytes = food.getImage();
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
                return ResponseEntity.status(500).body("Error retrieving food image: " + e.getMessage());
            }
        });
    }

    // Asynchronous method to delete a food item
 // Asynchronous method to delete a food item by ID
    @DeleteMapping("/{id}")
    @Async
    public CompletableFuture<ResponseEntity<?>> deleteFood(@PathVariable Long id) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Fetch the food item by ID
                Optional<Food> optionalFood = foodRepository.findById(id);
                if (optionalFood.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Food item not found");
                }

                // Delete the food item
                foodRepository.delete(optionalFood.get());
                return ResponseEntity.status(HttpStatus.OK).body("Food item deleted successfully");

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body("Error deleting food item: " + e.getMessage());
            }
        });
    }


    // Asynchronous method to search for a food item by name
    @GetMapping("/search")
    @Async
    public CompletableFuture<ResponseEntity<?>> searchFoodByName(@RequestParam String name) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Use the case-insensitive method from the repository
                List<Food> foods = foodRepository.findByNameIgnoreCase(name);
                
                if (foods.isEmpty()) {
                    return ResponseEntity.status(404).body("No food items found matching the search query");
                }
                
                return ResponseEntity.ok(foods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error searching for food items: " + e.getMessage());
            }
        });
    }
    
    // Filter method for high protein foods
    @GetMapping("/filter/protein")
    @Async
    public CompletableFuture<ResponseEntity<?>> filterHighProtein(@RequestParam double minProtein) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> highProteinFoods = foodRepository.findByProteinGreaterThanEqual(minProtein);
                if (highProteinFoods.isEmpty()) {
                    return ResponseEntity.status(404).body("No high-protein foods found");
                }
                return ResponseEntity.ok(highProteinFoods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error filtering high-protein foods: " + e.getMessage());
            }
        });
    }

    // Filter method for high fat foods
    @GetMapping("/filter/fat")
    @Async
    public CompletableFuture<ResponseEntity<?>> filterHighFat(@RequestParam double minFat) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> highFatFoods = foodRepository.findByFatGreaterThanEqual(minFat);
                if (highFatFoods.isEmpty()) {
                    return ResponseEntity.status(404).body("No high-fat foods found");
                }
                return ResponseEntity.ok(highFatFoods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error filtering high-fat foods: " + e.getMessage());
            }
        });
    }

    // Filter method for high carb foods
    @GetMapping("/filter/carbs")
    @Async
    public CompletableFuture<ResponseEntity<?>> filterHighCarbs(@RequestParam double minCarbs) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> highCarbFoods = foodRepository.findByNetCarbsGreaterThanEqual(minCarbs);
                if (highCarbFoods.isEmpty()) {
                    return ResponseEntity.status(404).body("No high-carb foods found");
                }
                return ResponseEntity.ok(highCarbFoods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error filtering high-carb foods: " + e.getMessage());
            }
        });
    }

    // Filter method for high energy foods
    @GetMapping("/filter/energy")
    @Async
    public CompletableFuture<ResponseEntity<?>> filterHighEnergy(@RequestParam double minEnergy) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> highEnergyFoods = foodRepository.findByEnergyGreaterThanEqual(minEnergy);
                if (highEnergyFoods.isEmpty()) {
                    return ResponseEntity.status(404).body("No high-energy foods found");
                }
                return ResponseEntity.ok(highEnergyFoods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error filtering high-energy foods: " + e.getMessage());
            }
        });
    }
    @GetMapping("/filter")
    @Async
    public CompletableFuture<ResponseEntity<?>> filterFoods(
        @RequestParam String filterType,
        @RequestParam double minValue) {
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Food> filteredFoods = new ArrayList<>();

                // Dynamically filter based on the filterType
                switch (filterType.toLowerCase()) {
                    case "protein":
                        filteredFoods = foodRepository.findByProteinGreaterThanEqual(minValue);
                        break;
                    case "fat":
                        filteredFoods = foodRepository.findByFatGreaterThanEqual(minValue);
                        break;
                    case "carbs":
                        filteredFoods = foodRepository.findByNetCarbsGreaterThanEqual(minValue);
                        break;
                    case "energy":
                        filteredFoods = foodRepository.findByEnergyGreaterThanEqual(minValue);
                        break;
                    default:
                        return ResponseEntity.status(400).body("Invalid filter type provided");
                }

                // Check if no foods are found
                if (filteredFoods.isEmpty()) {
                    return ResponseEntity.status(404).body("No " + filterType + " foods found");
                }

                return ResponseEntity.ok(filteredFoods);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error filtering foods: " + e.getMessage());
            }
        });
    }

}
