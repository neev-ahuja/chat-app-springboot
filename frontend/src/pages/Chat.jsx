import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import CreateChatModal from '../components/CreateChatModal';
import { useAuth } from '../context/authContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Chat = () => {
    const { token, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!loading && !token) navigate("/login");
    }, [token, loading, navigate]);

    if (loading) return null;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen w-full flex relative">
            <Sidebar setShowModal={setShowModal} />
            {location.pathname.startsWith('/chat/') && <ChatWindow />}
            {showModal && <CreateChatModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Chat;
