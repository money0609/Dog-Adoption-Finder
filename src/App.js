import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Header from './components/Header';
import NotFound from './pages/404'
function App() {
    return (
        <>
            <BrowserRouter basename="/Dog-Adoption-Finder">
                <Header />
                <Routes>
                    <Route path="" element={<Search />} />
                    <Route path="search" element={<Search />} />
                    <Route path="login" element={<Login />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;