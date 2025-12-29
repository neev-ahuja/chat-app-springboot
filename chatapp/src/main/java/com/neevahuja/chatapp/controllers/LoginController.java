package com.neevahuja.chatapp.controllers;


import com.neevahuja.chatapp.payloads.LoginRequest;
import com.neevahuja.chatapp.payloads.RegisterRequest;
import com.neevahuja.chatapp.services.LoginService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class LoginController {

    LoginService loginService;

    public LoginController(LoginService loginService){
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        try{
            String response = loginService.login(loginRequest.getUsername() , loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest){
        try{
            String response = loginService.register(registerRequest.getName() , registerRequest.getUsername() , registerRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
