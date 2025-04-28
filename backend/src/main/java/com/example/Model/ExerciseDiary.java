package com.example.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ExerciseDiary")
public class ExerciseDiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    private Long id; // Primary key for ExerciseDiary

    @Column(nullable = false, updatable = false)
    private String email; // Email will be populated from the session

    @Column(nullable = false, updatable = false)
    private LocalDate date; // Date will be set to today's date

    @Column(nullable = false)
    private String name; // Name of the exercise

    @Column(nullable = false)
    private double energy; // Energy burned in kcal

    @Column(nullable = false)
    private double protein; // Protein in g

    @Column(nullable = false)
    private double fat; // Fat in g

    @Column(nullable = false)
    private double netCarbs; // Net Carbs in g

    @Column(nullable = true) // Make duration nullable (optional)
    private Double duration; // Duration of the exercise in minutes (optional)

    @Column(nullable = true) // Category field is now optional
    private String category; // Category of the exercise (e.g., "Cardio", "Strength")

    public ExerciseDiary() {
    }

    // Constructor with duration made optional
    public ExerciseDiary(String email, LocalDate date, String name, double energy, double protein, double fat, double netCarbs, Double duration) {
        this.email = email;
        this.date = date;
        this.name = name;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.netCarbs = netCarbs;
        this.duration = duration; // duration is optional now
        this.category = null; // By default, category is null
    }

    // Constructor with category as optional
    public ExerciseDiary(String email, LocalDate date, String name, double energy, double protein, double fat, double netCarbs, Double duration, String category) {
        this.email = email;
        this.date = date;
        this.name = name;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.netCarbs = netCarbs;
        this.duration = duration; // duration is optional now
        this.category = category; // category can be passed as null or a value
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getEnergy() {
        return energy;
    }

    public void setEnergy(double energy) {
        this.energy = energy;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getNetCarbs() {
        return netCarbs;
    }

    public void setNetCarbs(double netCarbs) {
        this.netCarbs = netCarbs;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "ExerciseDiary [id=" + id + ", email=" + email + ", date=" + date + ", name=" + name + ", energy=" + energy
                + ", protein=" + protein + ", fat=" + fat + ", netCarbs=" + netCarbs + ", duration=" + duration + ", category=" + category + "]";
    }
}
