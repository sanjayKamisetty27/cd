package com.example.Controller;

import com.example.Model.ExerciseDiary;
import com.example.Interface.ExerciseDiaryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/exercisediary")
@CrossOrigin(origins = "http://localhost:3000") // Adjust based on your frontend URL
public class ExerciseDiaryService {

    @Autowired
    private ExerciseDiaryInterface exerciseDiaryRepository;

    @PostMapping("/add")
    public ExerciseDiary addExerciseItem(@RequestBody ExerciseDiary exerciseDiary, @RequestHeader("email") String email) {
        // Set the email from the session or header
        exerciseDiary.setEmail(email);

        // Set the current date as the date of the exercise entry
        LocalDate currentDate = LocalDate.now(ZoneId.systemDefault());
        exerciseDiary.setDate(currentDate);

        // If category is not provided, it will be null (optional field)
        System.out.println("Adding exercise item with date: " + currentDate);

        return exerciseDiaryRepository.save(exerciseDiary);
    }

    @GetMapping("/list/{date}")
    public List<ExerciseDiary> getUserExerciseDiaryByDate(@RequestHeader("email") String email, @PathVariable String date) {
        LocalDate queryDate = LocalDate.parse(date);
        System.out.println("Querying exercise diary for date: " + queryDate);
        return exerciseDiaryRepository.findByEmailAndDate(email, queryDate);
    }

    @GetMapping("/list")
    public List<ExerciseDiary> getUserExerciseDiary(@RequestHeader("email") String email) {
        return exerciseDiaryRepository.findByEmail(email);
    }

    @PostMapping("/save")
    public String saveExerciseEntry(@RequestParam String name, @RequestParam double energy, @RequestParam double protein,
                                     @RequestParam double fat, @RequestParam double netCarbs, @RequestParam double duration,
                                     @RequestParam String category, @RequestHeader("email") String sessionEmail) {

        ExerciseDiary exerciseDiary = new ExerciseDiary(sessionEmail, LocalDate.now(), name, energy, protein, fat, netCarbs, duration, category);
        exerciseDiaryRepository.save(exerciseDiary);
        return "Exercise entry saved successfully!";
    }


    // Delete an exercise item by ID
    @DeleteMapping("/delete/{id}")
    public String deleteExerciseItem(@PathVariable Long id, @RequestHeader("email") String email) {
        Optional<ExerciseDiary> exerciseDiary = exerciseDiaryRepository.findById(id);
        if (exerciseDiary.isPresent() && exerciseDiary.get().getEmail().equals(email)) {
            exerciseDiaryRepository.deleteById(id);
            return "Exercise item deleted successfully!";
        } else {
            return "Exercise item not found or unauthorized!";
        }
    }

    // Get details of a specific exercise item by ID
    @GetMapping("/details/{id}")
    public ExerciseDiary getExerciseItemDetails(@PathVariable Long id, @RequestHeader("email") String email) {
        Optional<ExerciseDiary> exerciseDiary = exerciseDiaryRepository.findById(id);
        if (exerciseDiary.isPresent() && exerciseDiary.get().getEmail().equals(email)) {
            return exerciseDiary.get();
        } else {
            throw new IllegalArgumentException("Exercise item not found or unauthorized!");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ExerciseDiary> updateExerciseItem(@PathVariable Long id, @RequestBody Map<String, Object> updateData) {
        Optional<ExerciseDiary> optionalExerciseItem = exerciseDiaryRepository.findById(id);
        if (optionalExerciseItem.isPresent()) {
            ExerciseDiary exerciseItem = optionalExerciseItem.get();

            if (updateData.containsKey("energy")) {
                exerciseItem.setEnergy((Double) updateData.get("energy"));
            }
            if (updateData.containsKey("protein")) {
                exerciseItem.setProtein((Double) updateData.get("protein"));
            }
            if (updateData.containsKey("fat")) {
                exerciseItem.setFat((Double) updateData.get("fat"));
            }
            if (updateData.containsKey("netCarbs")) {
                exerciseItem.setNetCarbs((Double) updateData.get("netCarbs"));
            }
            if (updateData.containsKey("duration")) {
                exerciseItem.setDuration((Double) updateData.get("duration"));
            }
            exerciseDiaryRepository.save(exerciseItem);
            return ResponseEntity.ok(exerciseItem);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats/{date}")
    public ResponseEntity<Map<String, Double>> getExerciseDiaryStatsByDate(@RequestHeader("email") String email,
                                                                           @PathVariable String date) {
        LocalDate queryDate = LocalDate.parse(date);
        List<ExerciseDiary> exerciseDiaryList = exerciseDiaryRepository.findByEmailAndDate(email, queryDate);

        double totalEnergy = 0;
        double totalProtein = 0;
        double totalFat = 0;
        double totalNetCarbs = 0;

        for (ExerciseDiary item : exerciseDiaryList) {
            totalEnergy += item.getEnergy();
            totalProtein += item.getProtein();
            totalFat += item.getFat();
            totalNetCarbs += item.getNetCarbs();
        }

        Map<String, Double> stats = Map.of("totalEnergy", totalEnergy, "totalProtein", totalProtein, "totalFat",
                totalFat, "totalNetCarbs", totalNetCarbs);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/exercisestats")
    public ResponseEntity<Map<String, Double>> getExerciseDiaryStats(@RequestHeader("email") String email) {
        List<ExerciseDiary> exerciseDiaryList = exerciseDiaryRepository.findByEmail(email);

        double totalEnergy = 0;
        double totalProtein = 0;
        double totalFat = 0;
        double totalNetCarbs = 0;

        for (ExerciseDiary item : exerciseDiaryList) {
            totalEnergy += item.getEnergy();
            totalProtein += item.getProtein();
            totalFat += item.getFat();
            totalNetCarbs += item.getNetCarbs();
        }

        Map<String, Double> stats = Map.of("totalEnergy", totalEnergy, "totalProtein", totalProtein, "totalFat",
                totalFat, "totalNetCarbs", totalNetCarbs);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/exercisestats/graph/{date}")
    public ResponseEntity<Map<String, Map<String, Object>>> getExerciseGraphDataByDate(
            @RequestHeader("email") String email,
            @PathVariable String date) {

        LocalDate queryDate = LocalDate.parse(date);
        List<ExerciseDiary> exerciseDiaryList = exerciseDiaryRepository.findByEmailAndDate(email, queryDate);

        Map<String, Map<String, Object>> graphData = new HashMap<>();

        for (ExerciseDiary item : exerciseDiaryList) {
            String category = item.getCategory() == null ? "Unknown" : item.getCategory(); // Get category
            String name = item.getName() == null ? "Unknown" : item.getName(); // Get name separately

            // Initialize category map if it doesn't exist
            graphData.putIfAbsent(category, new HashMap<>());

            Map<String, Object> categoryData = graphData.get(category);
            
            // Add name to category data
            categoryData.putIfAbsent("name", name);

            // Add nutrient data for the category
            categoryData.put("energy", (Double) categoryData.getOrDefault("energy", 0.0) + item.getEnergy());
            categoryData.put("protein", (Double) categoryData.getOrDefault("protein", 0.0) + item.getProtein());
            categoryData.put("fat", (Double) categoryData.getOrDefault("fat", 0.0) + item.getFat());
            categoryData.put("netCarbs", (Double) categoryData.getOrDefault("netCarbs", 0.0) + item.getNetCarbs());
        }

        // Debugging output to verify the constructed graph data
        System.out.println("Exercise Graph Data: " + graphData);

        return ResponseEntity.ok(graphData);
    }



}
