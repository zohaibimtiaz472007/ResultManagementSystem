import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import ResultForm from './components/ResultForm';
import ResultList from './components/ResultList';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path="/admin" element={
          <ProtectedRouteForAdmin>
          <AdminDashboard/>
          </ProtectedRouteForAdmin>
           } />
        <Route path="/results" element={
          <ProtectedRouteForAdmin>
          <ResultForm />
          </ProtectedRouteForAdmin>
          } />
        <Route path="/results-list" element={
          <ProtectedRouteForAdmin>
          <ResultList />
          </ProtectedRouteForAdmin>
          } />
      </Routes>
      <Toaster/>
    </Router>
  );
}

export default App;


export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('admin'))
  if (admin?.user?.email === "school@gmail.com") {
    return children
  }
  else {
    return <Navigate to={'/'} />
  }
}

