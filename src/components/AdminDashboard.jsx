import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/Config"; 
import logo from './logo.png'

const AdminDashboard = () => {
  const navigate = useNavigate();

  //* Logout Function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-green-500 shadow-md">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/results"
            className="bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-green-300">Add Result</h2>
          </Link>
          <Link
            to="/results-list"
            className="bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-green-300">View Result</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
