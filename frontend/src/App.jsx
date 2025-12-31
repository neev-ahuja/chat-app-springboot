import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthProvider from './context/authContext';
import SocketProvider from './context/socketContext';
import { Toaster } from 'react-hot-toast';

import { VideoCallProvider } from './context/VideoCallContext';
import VideoCallUI from './components/VideoCallUI';

function App() {

  return (
    <AuthProvider>
      <SocketProvider>
        <VideoCallProvider>
          <div>
            <Toaster />
            <VideoCallUI />
          </div>
          <Router>
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </VideoCallProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
