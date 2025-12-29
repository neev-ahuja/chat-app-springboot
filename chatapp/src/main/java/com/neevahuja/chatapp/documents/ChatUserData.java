package com.neevahuja.chatapp.documents;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatUserData {
    private String id;
    private Message lastMessage;
    private String user2;
    private String user2Id;
}