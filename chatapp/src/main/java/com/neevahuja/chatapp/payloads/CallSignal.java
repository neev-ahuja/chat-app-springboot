package com.neevahuja.chatapp.payloads;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CallSignal {
    private String type;
    private String callerId;
    private String receiverId;
    private String roomId;
}
