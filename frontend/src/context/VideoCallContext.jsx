import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSocket } from "./socketContext";
import { useAuth } from "./authContext";
import toast from "react-hot-toast";

const VideoCallContext = createContext();

export const useVideoCall = () => {
    return useContext(VideoCallContext);
};

const configuration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
    ],
};

export const VideoCallProvider = ({ children }) => {
    const { stompClient, isConnected } = useSocket();
    const { user } = useAuth();

    const [callStatus, setCallStatus] = useState("idle");
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callDetails, setCallDetails] = useState(null);

    const callDetailsRef = useRef(null);
    const callStatusRef = useRef("idle");
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        callDetailsRef.current = callDetails;
    }, [callDetails]);

    useEffect(() => {
        callStatusRef.current = callStatus;
    }, [callStatus]);

    useEffect(() => {
        if (!isConnected || !stompClient || !user) return;

        const subscription = stompClient.subscribe("/topic/call", (msg) => {
            const signal = JSON.parse(msg.body);
            console.log("RECEIVED SIGNAL:", signal.type, signal);
            handleSignal(signal);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [isConnected, stompClient, user]);

    const handleSignal = async (signal) => {
        if (signal.receiverId !== user.id && signal.callerId !== user.id) return;

        if (signal.receiverId === user.id) {

            const currentStatus = callStatusRef.current;

            switch (signal.type) {
                case "CALL_REQUEST":
                    if (currentStatus !== "idle") {
                        return;
                    }
                    setCallDetails(signal);
                    setCallStatus("incoming");
                    break;
                case "CALL_ACCEPT":
                    setCallStatus("connected");
                    initializePeerConnection(true);
                    break;
                case "CALL_REJECT":
                    cleanupCall();
                    toast.error("Call rejected");
                    break;
                case "CALL_END":
                    cleanupCall();
                    toast("Call ended", { icon: "ℹ️" });
                    break;
                case "OFFER":
                    await handleOffer(signal);
                    break;
                case "ANSWER":
                    await handleAnswer(signal);
                    break;
                case "ICE_CANDIDATE":
                    await handleIceCandidate(signal);
                    break;
                default:
                    break;
            }
        }
    };

    const startCall = (receiverId, receiverName, type = "voice") => {
        const roomId = `${user.id}-${receiverId}-${Date.now()}`;
        const signal = {
            type: "CALL_REQUEST",
            callerId: user.id,
            callerName: user.name, // Send my name
            receiverId: receiverId,
            receiverName: receiverName, // Store for local display
            roomId: roomId,
            callType: type
        };
        sendSignal(signal);
        setCallDetails(signal);
        setCallStatus("outgoing");
    };

    const acceptCall = async () => {
        const details = callDetailsRef.current;
        if (!details) return;

        const signal = {
            type: "CALL_ACCEPT",
            callerId: user.id,
            receiverId: details.callerId,
            roomId: details.roomId,
            callType: details.callType
        };
        sendSignal(signal);
        setCallStatus("connected");
        await initializePeerConnection(false);
    };

    const rejectCall = () => {
        const details = callDetailsRef.current;
        if (!details) return;

        const signal = {
            type: "CALL_REJECT",
            callerId: user.id,
            receiverId: details.callerId,
            roomId: details.roomId
        };
        sendSignal(signal);
        cleanupCall();
    };

    const endCall = () => {
        const details = callDetailsRef.current;
        if (!details) return;

        const receiver = details.callerId === user.id ? details.receiverId : details.callerId;
        const signal = {
            type: "CALL_END",
            callerId: user.id,
            receiverId: receiver,
            roomId: details.roomId
        };
        sendSignal(signal);
        cleanupCall();
    };

    const sendSignal = (signal) => {
        if (stompClient && isConnected) {
            let destination = "/topic/call";
            console.log("SENDING SIGNAL:", signal.type, signal);
            stompClient.publish({
                destination: destination,
                body: JSON.stringify(signal),
            });
        }
    };

    const initializePeerConnection = async (isInitiator) => {
        try {
            const details = callDetailsRef.current;
            const isVideo = details && details.callType === 'video';
            console.log("INITIALIZING MEDIA. CallType:", details?.callType, "IsVideo:", isVideo);

            const stream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;

            const pc = new RTCPeerConnection(configuration);
            peerConnectionRef.current = pc;

            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });

            pc.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                }
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const details = callDetailsRef.current;
                    if (!details) return;

                    const receiver = details.callerId === user.id ? details.receiverId : details.callerId;
                    const signal = {
                        type: "ICE_CANDIDATE",
                        callerId: user.id,
                        receiverId: receiver,
                        roomId: details.roomId,
                        candidate: event.candidate
                    };
                    sendSignal(signal);
                }
            };

            if (isInitiator) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const details = callDetailsRef.current;
                if (!details) return;

                const receiver = details.callerId === user.id ? details.receiverId : details.callerId;
                const signal = {
                    type: "OFFER",
                    callerId: user.id,
                    receiverId: receiver,
                    roomId: details.roomId,
                    sdp: JSON.stringify(offer)
                };
                sendSignal(signal);
            }

        } catch (error) {
            console.error("Error accessing media devices.", error);
            toast.error("Could not access camera/microphone");
            cleanupCall();
        }
    };

    const handleOffer = async (signal) => {
        if (!peerConnectionRef.current) {
            return;
        }

        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(signal.sdp)));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const signalToSend = {
            type: "ANSWER",
            callerId: user.id,
            receiverId: signal.callerId,
            roomId: signal.roomId,
            sdp: JSON.stringify(answer)
        };
        sendSignal(signalToSend);
    };

    const handleAnswer = async (signal) => {
        const pc = peerConnectionRef.current;
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(signal.sdp)));
        }
    };

    const handleIceCandidate = async (signal) => {
        const pc = peerConnectionRef.current;
        if (pc && signal.candidate) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
            } catch (e) {
                console.error("Error adding ice candidate", e);
            }
        }
    };

    const cleanupCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setLocalStream(null);
        setRemoteStream(null);
        setCallStatus("idle");
        setCallDetails(null);
        peerConnectionRef.current = null;
        localStreamRef.current = null;
    };


    return (
        <VideoCallContext.Provider
            value={{
                callStatus,
                localStream,
                remoteStream,
                startCall,
                acceptCall,
                rejectCall,
                endCall,
                callDetails
            }}
        >
            {children}
        </VideoCallContext.Provider>
    );
};
