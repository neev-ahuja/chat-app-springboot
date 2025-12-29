package com.neevahuja.chatapp.services;

import com.neevahuja.chatapp.documents.Chats;
import com.neevahuja.chatapp.documents.Users;
import com.neevahuja.chatapp.repos.ChatRepo;
import com.neevahuja.chatapp.repos.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    UserRepo userRepo;

    public UserService(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    public Users getUser(String username) throws Exception{
        return userRepo.getByUsername(username);
    }

    public Users getUserById(String id) throws Exception{
        return userRepo.getById(id);
    }

    public void deleteUser(String username) throws Exception{
        userRepo.delete(userRepo.getByUsername(username));
    }
}
