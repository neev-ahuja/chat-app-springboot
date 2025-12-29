package com.neevahuja.chatapp.controllers;


import com.neevahuja.chatapp.documents.Users;
import com.neevahuja.chatapp.services.UserService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test(){
        return "TESt";
    }

    @GetMapping
    public ResponseEntity<?> getUser(){
        try{
            Users user = userService.getUser(SecurityContextHolder.getContext().getAuthentication().getName());
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(){
        try{
            userService.deleteUser(SecurityContextHolder.getContext().getAuthentication().getName());
            return ResponseEntity.ok("User Deleted Successfully");
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
