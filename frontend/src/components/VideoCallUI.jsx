import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '../context/VideoCallContext';
import { useAuth } from '../context/authContext';

const VideoCallUI = () => {
    const {
        callStatus,
        localStream,
        remoteStream,
        acceptCall,
        rejectCall,
        endCall,
        callDetails
    } = useVideoCall();

    const { user } = useAuth();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [duration, setDuration] = useState(0);

    const isVideoCall = callDetails?.callType === 'video';

    useEffect(() => {
        let interval;
        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getDisplayName = () => {
        if (!callDetails) return "Unknown";
        if (callStatus === 'outgoing') return callDetails.receiverName || "User";
        if (callStatus === 'incoming') return callDetails.callerName || "User";
        const amICaller = callDetails.callerId === user.id;
        return amICaller ? (callDetails.receiverName || "User") : (callDetails.callerName || "User");
    };

    const getDisplayInitial = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    }

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, isVideoCall]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (callStatus === 'idle') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]">

                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <h3 className="text-lg font-semibold dark:text-white">
                        {callStatus === 'incoming' ? 'Incoming Call' :
                            callStatus === 'outgoing' ? 'Calling...' :
                                'Connected'}
                    </h3>
                    <div className="text-sm text-slate-500">
                        {callStatus === 'connected' ? formatTime(duration) : '00:00'}
                    </div>
                </div>

                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    <div className={`absolute inset-0 z-0 flex items-center justify-center ${!isVideoCall ? 'opacity-0 pointer-events-none' : ''}`}>
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white/50 flex flex-col items-center gap-2">
                                <div className="h-20 w-20 rounded-full bg-slate-800 animate-pulse"></div>
                                <span>{callStatus === 'connected' ? 'Waiting for video...' : 'Connecting...'}</span>
                            </div>
                        )}
                    </div>

                    {!isVideoCall && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-linear-to-b from-slate-900 to-black">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full bg-slate-800 flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-slate-700">
                                    {getDisplayInitial()}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full border-4 border-black z-10 animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-3xl text-white font-semibold mb-2 tracking-wide">
                                    {getDisplayName()}
                                </h2>
                                <p className="text-slate-400 font-mono">
                                    {callStatus === 'connected' ? formatTime(duration) : 'Ring...'}
                                </p>
                            </div>
                        </div>
                    )}

                    {isVideoCall && localStream && (
                        <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 z-10 transition-all hover:scale-105 cursor-grab">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform -scale-x-100"
                            />
                        </div>
                    )}

                    {(callStatus === 'incoming' || callStatus === 'outgoing') && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-[pulse_1.5s_infinite]">
                                <span className="material-symbols-outlined text-5xl text-primary">
                                    {callStatus === 'incoming' ? 'call' : 'ring_volume'}
                                </span>
                            </div>
                            <h2 className="text-2xl text-white font-bold mb-2">
                                {callStatus === 'incoming' ? 'Incoming Call' : 'Calling...'}
                            </h2>
                            <h3 className="text-xl text-white font-semibold mb-2">
                                {getDisplayName()}
                            </h3>
                            <p className="text-white/60">
                                {callStatus === 'incoming' ? `Requesting ${callDetails?.callType} call...` : 'Waiting for answer...'}
                            </p>
                        </div>
                    )}

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-xl transition-all hover:bg-black/60">
                        {callStatus === 'incoming' ? (
                            <>
                                <button
                                    onClick={rejectCall}
                                    className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-110"
                                    title="Reject"
                                >
                                    <span className="material-symbols-outlined text-3xl">call_end</span>
                                </button>
                                <button
                                    onClick={acceptCall}
                                    className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-transform hover:scale-110 animate-bounce"
                                    title="Accept"
                                >
                                    <span className="material-symbols-outlined text-3xl">call</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={endCall}
                                className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:shadow-red-900/50"
                                title="End Call"
                            >
                                <span className="material-symbols-outlined text-3xl">call_end</span>
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VideoCallUI;
