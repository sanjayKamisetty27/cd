package com.example.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "FoodDiary")
public class FoodDairy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Ensure the primary key is auto-generated
    private Long id; // Primary key for the entity

    @Column(nullable = false, updatable = false)
    private String email; // Email will be populated from the session

    @Column(nullable = false, updatable = false)
    private LocalDate date; // Date will be set to today's date

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double energy; // Energy in kcal

    @Column(nullable = false)
    private Double protein; // Protein in g

    @Column(nullable = false)
    private Double fat; // Fat in g

    @Column(nullable = false)
    private Double netCarbs; // Net Carbs in g

    @Column(nullable = true) // Make quantity nullable (optional)
    private Double quantity; // Quantity of the food item (in grams or serving size)

    @Column(nullable = true) // Category field is now optional
    private String category; // Category of the food item (e.g., "Vegetable", "Fruit", etc.)

    public FoodDairy() {
    }

    // Constructor with category made optional
    public FoodDairy(String email, LocalDate date, String name, Double energy, Double protein, Double fat, Double netCarbs, Double quantity) {
        this.email = email;
        this.date = date;
        this.name = name;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.netCarbs = netCarbs;
        this.quantity = quantity; // quantity is optional now
        this.category = null; // By default, category is null
    }

    // Constructor with category as optional
    public FoodDairy(String email, LocalDate date, String name, Double energy, Double protein, Double fat, Double netCarbs, Double quantity, String category) {
        this.email = email;
        this.date = date;
        this.name = name;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.netCarbs = netCarbs;
        this.quantity = quantity; // quantity is optional now
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

    public Double getEnergy() {
        return energy;
    }

    public void setEnergy(Double energy) {
        this.energy = energy;
    }

    public Double getProtein() {
        return protein;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public Double getFat() {
        return fat;
    }

    public void setFat(Double fat) {
        this.fat = fat;
    }

    public Double getNetCarbs() {
        return netCarbs;
    }

    public void setNetCarbs(Double netCarbs) {
        this.netCarbs = netCarbs;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "FoodDairy [id=" + id + ", email=" + email + ", date=" + date + ", name=" + name + ", energy=" + energy
                + ", protein=" + protein + ", fat=" + fat + ", netCarbs=" + netCarbs + ", quantity=" + quantity 
                + ", category=" + category + "]";
    }
}
