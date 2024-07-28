import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Config';

const HomePage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        if (!email || !password) {
            return toast.error("Please fill all the fields");
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login Successful");
            localStorage.setItem('admin', JSON.stringify(result));
            navigate('/admin');
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-green-500 mb-2">Result Management System</h1>
                    <p className="text-xl text-green-300">Access Your Results Securely</p>
                </header>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-green-300">Username</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="username"
                            name="email"
                            className="mt-1 block w-full px-4 py-2 rounded-md bg-gray-800 text-green-300 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-green-300">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-4 py-2 rounded-md bg-gray-800 text-green-300 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <button
                            onClick={login}
                            type="button"
                            className="w-full py-2 px-4 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
