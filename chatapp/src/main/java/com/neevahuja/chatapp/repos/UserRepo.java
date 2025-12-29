package com.neevahuja.chatapp.repos;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.neevahuja.chatapp.documents.Users;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {
    public Users getByUsername(String username);
    Users getById(String id);
}