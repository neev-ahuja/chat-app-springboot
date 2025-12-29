package com.neevahuja.chatapp.filters;

import com.neevahuja.chatapp.services.JWTService;
import com.neevahuja.chatapp.services.MyUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    JWTService jwtService;

    ApplicationContext applicationContext;

    @Autowired
    public JwtFilter(JWTService jwtService , ApplicationContext applicationContext){
        this.jwtService = jwtService;
        this.applicationContext = applicationContext;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{

            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            try{
                if(authHeader != null && authHeader.startsWith("Bearer ")){
                    token = authHeader.substring(7);
                    username = jwtService.extractUserName(token);
                }
            } catch (ExpiredJwtException e){
                response.setStatus(401);
                return;
            }


            if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){

                UserDetails userDetails = applicationContext.getBean(MyUserDetailsService.class).loadUserByUsername(username);
                if(jwtService.validateToken(token , userDetails)){
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails , null ,userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

            filterChain.doFilter(request , response);
        } catch (Exception e){
            response.setStatus(401);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String json = """
                       {
                            "status" : "%d" ,
                            "error" : "%s"
                       } 
                    """.formatted(401 , e.getMessage());

            response.getWriter().write(json);
        }
    }
}
