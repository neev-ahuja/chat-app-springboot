import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

const Register = () => {

    const [name , setName] = useState("");
    const [username , setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();


    const {register} = useAuth();

    const handleRegister =async () => {
        if(username.trim() !== "" && password != "" && password === confirmPassword){
            await register(username , password , name);
            if(localStorage.getItem("token") != null) {
                toast.success("Registered SucessFully");
                navigate('/');
                return;
            }
        toast.error("Error in Register")

        }
        toast.error(password !== confirmPassword ? "Passwords do not match" : "Error in Register")
    }
    
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 font-display">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400">Join our community and start chatting</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            type="text"
                            required
                        />
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
                            username
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text"
                            required
                        />
                    </div>
                    

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            id="confirm-password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            required
                        />
                    </div>

                    <button onClick={() => handleRegister()} className="block w-full py-3.5 px-4 bg-primary hover:bg-blue-500 text-white text-center font-semibold rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95 mt-2">
                        Sign Up
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link className="font-semibold text-primary hover:text-blue-600 transition-colors" to="/login">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
