import React, { useEffect, useState, useRef } from 'react';
import { formatMessageTime } from '../utils/dateUtils';
import { useActionData, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/authContext';
import { useSocket } from '../context/socketContext';
import toast from 'react-hot-toast';
const ChatWindow = () => {

    const { chatId } = useParams();

    const { user } = useAuth();

    const [user2, setUser2] = useState();

    const [chat, setChat] = useState();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const { stompClient, isConnected } = useSocket();

    const [content, setContent] = useState("");

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await api.get("/api/chat/" + chatId);
                const chatData = response.data;
                setChat(response.data);
                setUser2(chatData.users[0].id === user.id ? chatData.users[1] : chatData.users[0])
            } catch (err) {
                navigate("/");
                console.log(err);
            }
            setIsLoading(false);
        }
        fetchChat();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    useEffect(() => {
        if (!isConnected || !stompClient) return;

        const subscription = stompClient.subscribe(
            `/topic/message-received/${chatId}`,
            (msg) => {
                const message = JSON.parse(msg.body);

                setChat((prev) => ({
                    ...prev,
                    messages: [...prev.messages, message],
                }));
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, isConnected, chatId]);

    const sendMessage = () => {
        if (!stompClient || !isConnected) return;

        stompClient.publish({
            destination: `/app/send-message/${chatId}`,
            body: JSON.stringify({
                sender: user.id,
                receiver: user2.id,
                content,
            }),
        });
        setContent("");
    };


    if (isLoading) return (
        <div>
            loading
        </div>
    )

    return (
        <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-background-dark relative">
            {/* Chat Header */}
            <header className="h-18 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300" data-alt="User profile picture showing a smiling person" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5wmUSUJY_2HQLED-evNFgGMuxPgub2WmZmkNhbb0PWjWQfsHa_LFH6b1Xsz8JPoM2IOBGvHtIpHrW4i8lGUETKBpVQpJ6F25TAd0vT6YUDzmCZWrC9D6UIj9ZBFROEqiE53FFV5XmpglxQ_F7Ri4rrhp0jy7rSikGVlRY6nOgpZOXhpMNoYxP-TnVCiqgCy6XICmEZ3FePJui3Z42EyenX4WNbQQiqVJqatetFRINjmv79JhzVaN0JcTFLd8sNsxdshNHJd8unjs")' }}>
                        </div>
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
                    </div>
                    <div>
                        <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{user2 && user2.name}</h2>
                        {/* <p className="text-primary text-xs font-medium animate-pulse">Typing...</p> */}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => toast.error("Feature coming soon!")}
                        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-300 transition-colors" title="Start Call">
                        <span className="material-symbols-outlined text-[22px]">call</span>
                    </button>
                    <button
                        onClick={() => toast.error("Feature coming soon!")}
                        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-300 transition-colors" title="Video Call">
                        <span className="material-symbols-outlined text-[24px]">videocam</span>
                    </button>
                    <button
                        onClick={() => toast.error("Feature coming soon!")}
                        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500 dark:text-slate-300 transition-colors" title="More Info">
                        <span className="material-symbols-outlined text-[22px]">info</span>
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-slate-50 dark:bg-background-dark" id="message-container">
                {chat &&
                    chat.messages && chat.messages.map((message, index) => {
                        return (
                            <div className={`flex gap-3 max-w-[80%] ${message.sender === user.id ? "self-end flex-row-reverse" : "self-start"} group`} key={index}>
                                <div className={`flex flex-col gap-1 ${message.sender === user.id && "items-end"}`}>
                                    <div className={message.sender === user.id ? "bg-primary text-white p-3.5 rounded-2xl rounded-br-none shadow-md shadow-primary/20" : "bg-white dark:bg-surface-dark p-3.5 rounded-2xl rounded-bl-none shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50"}>
                                        <p className={`text-sm leading-relaxed ${message.sender !== user.id && "text-slate-800 dark:text-slate-200"}`}>{message.content}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mr-1">
                                        <span className="text-[10px] text-slate-400 font-medium">{formatMessageTime(message.timestamp)}</span>
                                        {
                                            message.sender === user.id &&
                                            <span className="material-symbols-outlined text-[12px] text-primary">done_all</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div ref={messagesEndRef} />
            </div>


            {/* Input Area */}
            <div className="px-6 pb-6 pt-2 bg-slate-50 dark:bg-background-dark shrink-0">
                <div className="flex items-end gap-3 bg-white dark:bg-surface-dark p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 ring-1 ring-transparent focus-within:ring-primary/50 transition-all">
                    <button
                        onClick={() => toast.error("Feature coming soon!")}
                        className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-background-dark transition-colors shrink-0">
                        <span className="material-symbols-outlined text-[22px]">add_circle</span>
                    </button>
                    <div className="flex-1 py-2">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            className="w-full bg-transparent border-none p-0 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 resize-none max-h-32 leading-relaxed" placeholder="Type a message..." rows="1"></textarea>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 pb-0.5">
                        <button
                            onClick={() => toast.error("Feature coming soon!")}
                            className="p-2 rounded-xl text-slate-400 hover:text-yellow-500 hover:bg-slate-50 dark:hover:bg-background-dark transition-colors">
                            <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
                        </button>
                        <button
                            onClick={sendMessage}
                            className="flex items-center justify-center p-2 h-10 w-10 bg-primary hover:bg-blue-500 text-white rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95 ml-1">
                            <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ChatWindow;
