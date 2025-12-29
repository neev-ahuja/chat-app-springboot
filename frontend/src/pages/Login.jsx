import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

import toast from 'react-hot-toast';

const Login = () => {
    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");

    const [isLoading , setIsLoading] = useState(false);

    const {login} = useAuth();

    const navigate = useNavigate();

    const handleSubmit =async () => {
        try{
            await login(username , password);
            if(localStorage.getItem("token") == null) {
                toast.error("Wrong Credentials")
                return ;
            }
            toast.success("Logged In Successfully");
            navigate("/");
        } catch(err) {
            toast.error(err.message);
        } finally{
            setIsLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 font-display">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sign in to continue your conversations</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
                            Username
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            id="email"
                            placeholder="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                                Password
                            </label>
                        </div>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button onClick={isLoading ?() => {
                        toast.error("Wait Before Trying Again")
                    }  : () => {
                        setIsLoading(true);
                        handleSubmit();
                    }} className="block w-full py-3.5 px-4 bg-primary hover:bg-blue-500 text-white text-center font-semibold rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95">
                        {
                            isLoading ? "Logging In..." : "Log In"
                        }
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link className="font-semibold text-primary hover:text-blue-600 transition-colors" to="/register">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
