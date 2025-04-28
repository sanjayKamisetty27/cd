package com.example.Interface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.example.Model.User;

@Repository
public class DAO {

    @Autowired
    private UserInterface repo;

    public void insert(User user) {
        try {
            repo.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save user: " + e.getMessage(), e);
        }
    }
}
