import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewsDetail from './pages/NewsDetail'
import EventDetail from './pages/EventDetail'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
