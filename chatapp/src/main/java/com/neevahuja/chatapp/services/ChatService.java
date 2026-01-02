package com.neevahuja.chatapp.services;

import com.neevahuja.chatapp.documents.ChatUserData;
import com.neevahuja.chatapp.documents.Chats;
import com.neevahuja.chatapp.documents.Message;
import com.neevahuja.chatapp.documents.Users;
import com.neevahuja.chatapp.repos.ChatRepo;
import com.neevahuja.chatapp.repos.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;

import java.util.*;

@Service
public class ChatService {

    ChatRepo chatRepo;
    UserRepo userRepo;

    public ChatService(ChatRepo chatRepo , UserRepo userRepo){
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
    }

    public Chats getChatById(String chatId) {
        return chatRepo.getChatById(chatId);
    }

    public void addChat(String username) throws Exception {

        Users user1 = userRepo.getByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        Users user2 = userRepo.getByUsername(username);

        if(user2 == null) {
            throw new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR , "USER NOT FOUND");
        }


        Chats chat = new Chats();
        chat.setUsers(List.of(user1 , user2));
        chat.setMessages(new ArrayList<>());

        Message newMessage = new Message(user1.getId() , user2.getId() , user1.getName() + " started a chat");

        chat.getMessages().add(newMessage);

        chatRepo.save(chat);


        if(user1.getChats() == null) user1.setChats(new HashMap<>());
        if(user2.getChats() == null) user2.setChats(new HashMap<>());

        user1.getChats().put(chat.getId() , new ChatUserData(chat.getId() , newMessage , user2.getName() , user2.getId()));
        user2.getChats().put(chat.getId() ,new ChatUserData(chat.getId() , newMessage , user1.getName() , user1.getId()));

        userRepo.save(user1);
        userRepo.save(user2);
    }

    public HashMap<String , ChatUserData> getAllChats() throws Exception{
        Users user = userRepo.getByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return user.getChats();
    }

    public void addMessage(String chatId , Message msg) {
        Chats chat = chatRepo.getChatById(chatId);
        if(chat.getMessages() == null) chat.setMessages(new ArrayList<>());
        Users user1 = userRepo.getById(msg.getSender());
        Users user2 = userRepo.getById(msg.getReceiver());
        chat.getMessages().add(msg);
        user1.getChats().get(chatId).setLastMessage(msg);
        user2.getChats().get(chatId).setLastMessage(msg);
        userRepo.save(user1);
        userRepo.save(user2);
        chatRepo.save(chat);
    }
}
