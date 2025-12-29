package com.neevahuja.chatapp.documents;

import lombok.*;

import java.util.Date;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Generated
    private String id;
    private String sender;
    private String receiver;
    private String content;
    private Date timestamp;

    public Message(String sender , String receiver , String content){
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.timestamp = new Date(System.currentTimeMillis());
    }
}
