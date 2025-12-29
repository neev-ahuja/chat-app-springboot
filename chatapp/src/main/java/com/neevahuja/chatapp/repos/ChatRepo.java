package com.neevahuja.chatapp.repos;

import com.neevahuja.chatapp.documents.Chats;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRepo extends MongoRepository<Chats, String> {
    Chats getChatById(String id);
}
