package com.example.Model;

import jakarta.persistence.*;
import java.util.Arrays;

@Entity
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id; // Unique identifier for the Exercise

    @Column(unique = true, nullable = false)
    private String name; // Exercise name, must be unique

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] image; // Store image as a byte array (BLOB)

    @Column(nullable = false)
    private double energy; // Energy in kcal

    @Column(nullable = false)
    private double protein; // Protein in g

    @Column(nullable = false)
    private double fat; // Fat in g

    @Column(nullable = false)
    private double netCarbs; // Net Carbs in g

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

    @Override
    public String toString() {
        return "Exercise [id=" + id + ", name=" + name + ", image=" + Arrays.toString(image) + ", energy=" + energy 
                + ", protein=" + protein + ", fat=" + fat + ", netCarbs=" + netCarbs + "]";
    }
}
