package com.neevahuja.chatapp.services;

import com.neevahuja.chatapp.documents.Users;
import com.neevahuja.chatapp.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    public LoginService(UserRepo userRepo , AuthenticationManager authenticationManager , JWTService jwtService){
        this.userRepo = userRepo;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public String login(String username , String password){
        try{
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            password
                    );
            Authentication auth = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e){
            return "FAILED TO LOGIN " + e.getMessage();
        }
        return jwtService.generateToken(username);
    }


    public String register(String name, String username, String password) {
        Users user = new Users(name , username , passwordEncoder.encode(password));
        if(userRepo.getByUsername(username) != null) {
            return "USERNAME ALREADY EXISTS";
        }
        userRepo.save(user);
        return "SUCESS";
    }
}
