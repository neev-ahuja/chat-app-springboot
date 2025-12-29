import React, { useEffect, useState } from 'react';
import { formatMessageTime } from '../utils/dateUtils';
import { useAuth } from '../context/authContext';
import api from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = ({ setShowModal }) => {

    const { user, logOut , isConnected} = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [chats, setChats] = useState([]);

    const location = useLocation();

    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        toast.success("Logged out Successfully")
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get("/api/chat");
                setChats(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        if(isConnected)fetchChats();
    }, [isConnected]);

    return (
        <aside className="w-[320px] md:w-95 h-full flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-secondary-dark z-20 shrink-0">
            {/* Sidebar Header: Profile */}
            <div className="px-5 pt-6 pb-2 shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative group cursor-pointer profile-menu-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300" data-alt="User profile picture showing a smiling person" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5wmUSUJY_2HQLED-evNFgGMuxPgub2WmZmkNhbb0PWjWQfsHa_LFH6b1Xsz8JPoM2IOBGvHtIpHrW4i8lGUETKBpVQpJ6F25TAd0vT6YUDzmCZWrC9D6UIj9ZBFROEqiE53FFV5XmpglxQ_F7Ri4rrhp0jy7rSikGVlRY6nOgpZOXhpMNoYxP-TnVCiqgCy6XICmEZ3FePJui3Z42EyenX4WNbQQiqVJqatetFRINjmv79JhzVaN0JcTFLd8sNsxdshNHJd8unjs")' }}>
                            </div>
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-secondary-dark"></div>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="absolute top-12 left-0 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || user.username}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-base font-bold leading-tight dark:text-white">{user.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">Online</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => toast.error("Feature coming soon!")}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                        </button>
                        <button
                            onClick={() => toast.error("Feature coming soon!")}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                        </button>
                    </div>
                </div>

                <div className="relative mb-2"
                    onClick={() => toast.error("Feature coming soon!")}
                >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </span>
                    <input className="w-full py-2.5 pl-10 pr-4 bg-slate-100 dark:bg-surface-dark text-sm rounded-xl border-none focus:ring-2 focus:ring-primary placeholder-slate-400 dark:text-white transition-all" placeholder="Search messages..." type="text" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                {
                    Object.values(chats).length > 0 ?
                        Object.values(chats).map((chat) => {
                            return (
                                <div className={`group flex items-center gap-3 p-3 rounded-xl ${location.pathname === "/chat/" + chat.id ? "bg-primary/10" : "hover:bg-slate-100 dark:hover:bg-slate-800"} cursor-pointer transition-colors relative`}
                                    onClick={() => navigate("/chat/" + chat.id)}
                                    key={chat.id}
                                >

                                    <div className="relative shrink-0">

                                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300" data-alt="User profile picture showing a smiling person" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5wmUSUJY_2HQLED-evNFgGMuxPgub2WmZmkNhbb0PWjWQfsHa_LFH6b1Xsz8JPoM2IOBGvHtIpHrW4i8lGUETKBpVQpJ6F25TAd0vT6YUDzmCZWrC9D6UIj9ZBFROEqiE53FFV5XmpglxQ_F7Ri4rrhp0jy7rSikGVlRY6nOgpZOXhpMNoYxP-TnVCiqgCy6XICmEZ3FePJui3Z42EyenX4WNbQQiqVJqatetFRINjmv79JhzVaN0JcTFLd8sNsxdshNHJd8unjs")' }}>
                                        </div>
                                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-secondary-dark"></div>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-semibold text-sm truncate dark:text-white">{chat.user2}</h3>
                                            <span className="text-xs text-primary font-medium">{chat.lastMessage && formatMessageTime(chat.lastMessage.timestamp)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">{chat.lastMessage && chat.lastMessage.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : (
                            <div>
                                No Chats
                            </div>
                        )
                }
            </div>

            <div className='fixed bottom-0 m-4 bg-blue-400 p-4 px-20 rounded-4xl left-10 cursor-pointer' onClick={() => setShowModal(true)}>
                Add Chat
            </div>
        </aside>
    );
};

export default Sidebar;
