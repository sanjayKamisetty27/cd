package com.example.Model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Arrays;

@Entity
public class Recommendation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id; // Unique identifier for Recipe

    @Column(unique = true, nullable = false)
    private String name; // Recipe name, must be unique

    private String description;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] image; // Store image as a byte array (BLOB)

    private double energy;
    private double protein;
    private double fat;
    private double netCarbs;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private String cookingSteps; // Detailed cooking steps

    private String nutritionalLevel; // Nutritional level (e.g., High Protein, High Net Carbs, etc.)

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
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

    public String getCookingSteps() {
        return cookingSteps;
    }

    public void setCookingSteps(String cookingSteps) {
        this.cookingSteps = cookingSteps;
    }

    public String getNutritionalLevel() {
        return nutritionalLevel;
    }

    public void setNutritionalLevel(String nutritionalLevel) {
        this.nutritionalLevel = nutritionalLevel;
    }

    @Override
    public String toString() {
        return "Recipe [id=" + id + ", name=" + name + ", description=" + description + ", image=" + Arrays.toString(image)
                + ", energy=" + energy + ", protein=" + protein + ", fat=" + fat + ", netCarbs=" + netCarbs
                + ", cookingSteps=" + cookingSteps + ", nutritionalLevel=" + nutritionalLevel + "]";
    }
}
