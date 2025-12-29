package com.neevahuja.chatapp.controllers;

import com.neevahuja.chatapp.payloads.CallSignal;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;


@Controller
@CrossOrigin("*")
public class CallingSocketController {

    @MessageMapping("/call/request")
    @SendTo("/topic/call")
    public CallSignal callRequest(CallSignal signal) {
        signal.setType("CALL_REQUEST");
        return signal;
    }

    @MessageMapping("/call/accept")
    @SendTo("/topic/call")
    public CallSignal acceptCall(CallSignal signal) {
        signal.setType("CALL_ACCEPT");
        return signal;
    }

    @MessageMapping("/call/reject")
    @SendTo("/topic/call")
    public CallSignal rejectCall(CallSignal signal) {
        signal.setType("CALL_REJECT");
        return signal;
    }

    @MessageMapping("/call/end")
    @SendTo("/topic/call")
    public CallSignal endCall(CallSignal signal) {
        signal.setType("CALL_END");
        return signal;
    }
}