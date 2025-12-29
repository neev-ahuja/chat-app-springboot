package com.neevahuja.chatapp.controllers;

import com.neevahuja.chatapp.payloads.NewMessageRequest;
import com.neevahuja.chatapp.services.ChatService;
import com.neevahuja.chatapp.services.UserService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.neevahuja.chatapp.documents.Message;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@CrossOrigin("*")
public class ChatSocketController {

    ChatService chatService;

    public ChatSocketController(ChatService chatService ){
        this.chatService = chatService;
    }

    @MessageMapping("/send-message/{chatId}")
    @SendTo("/topic/message-received/{chatId}")
    public Message sendMessage(@DestinationVariable String chatId , NewMessageRequest msg){
        try{
            Message message = new Message(msg.getSender(), msg.getReceiver() , msg.getContent());
            chatService.addMessage(chatId ,message);
            return message;
        } catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }
    }
}
