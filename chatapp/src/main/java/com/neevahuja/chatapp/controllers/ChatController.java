package com.neevahuja.chatapp.controllers;


import com.neevahuja.chatapp.documents.ChatUserData;
import com.neevahuja.chatapp.documents.Chats;
import com.neevahuja.chatapp.documents.Message;
import com.neevahuja.chatapp.payloads.AddChatRequest;
import com.neevahuja.chatapp.payloads.NewMessageRequest;
import com.neevahuja.chatapp.services.ChatService;
import com.neevahuja.chatapp.services.UserService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatController {

    ChatService chatService;

    public ChatController(ChatService chatService){
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<?> getAllChats() throws  Exception{
        HashMap<String , ChatUserData> list = chatService.getAllChats();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<?> getChat(@PathVariable String chatId) {
        Chats chat = chatService.getChatById(chatId);
        return ResponseEntity.status(HttpStatusCode.valueOf(200)).body(chat);
    }

    @PostMapping
    public ResponseEntity<String> addChat(@RequestBody AddChatRequest addChatRequest) throws Exception{
        chatService.addChat(addChatRequest.getUsername());
        return ResponseEntity.ok("Chat Added to the User");
    }

    @PostMapping("/addMessage/{chatId}")
    public ResponseEntity<String> addMesage(@PathVariable String chatId , @RequestBody NewMessageRequest msg){
        chatService.addMessage(chatId , new Message(msg.getSender() , msg.getReceiver(), msg.getContent()));
        return ResponseEntity.ok("SUCESS");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        return ResponseEntity.status(HttpStatusCode.valueOf(500)).body(e.getMessage());
    }
}
