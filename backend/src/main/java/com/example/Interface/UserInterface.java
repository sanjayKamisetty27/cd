package com.example.Interface;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Model.User;

public interface UserInterface extends JpaRepository<User, String> 
{
	
	public User findByEmail(String email);
	List<User> findAll();
	

}
