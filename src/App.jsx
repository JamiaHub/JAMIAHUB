import { HashRouter, Navigate, Route, Routes, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Community from "./pages/Community"
import Resources from "./pages/Resources"
import Login from "./pages/Login"
import Cgpa from "./pages/Cgpa"
import SignUp from "./pages/SignUp"
import Game from "./pages/Game"
import toast, { Toaster } from "react-hot-toast"
import useAuthUser from "./hook/useAuthUser"
import PageLoader from "./components/PageLoader"
import ScrollToTop from "./components/ScrollToTop"

export default function App() {
  const { isLoading } = useAuthUser;
  
  if (isLoading) return <PageLoader />
  
  return (
    <HashRouter >
      <ScrollToTop/>
      <div className="h-screen" data-theme="forest">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cgpa" element={<Cgpa />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/games" element={<Game />} />
        </Routes>
        
        <Toaster />
        
        {/* Footer Section */}
        <footer className="bg-gradient-to-b from-gray-950 to-black">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-300">
            
            {/* Branding */}
            <div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">JamiaHub</h3>
              <p className="text-sm leading-relaxed">
                A student-powered platform built to simplify academics, foster collaboration, and celebrate community at Jamia Millia Islamia.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-purple-400 transition">Home</Link></li>
                <li><Link to="/resources" className="hover:text-purple-400 transition">Resources</Link></li>
                <li><Link to="/community" className="hover:text-purple-400 transition">Community</Link></li>
                <li><Link to="/about" className="hover:text-purple-400 transition">About</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Connect With Us</h4>
              <div className="flex gap-6">
                <a href="https://www.linkedin.com/in/mahtab-madni-391364327" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition transform hover:scale-110">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/itz_mahtab25?igsh=ZmZvMmswcHEzcGU%3D" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition transform hover:scale-110">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500 py-6 border-t border-gray-700">
            &copy; {new Date().getFullYear()} JamiaHub. All rights reserved.
          </div>
        </footer>
      </div>
    </HashRouter>
  )
}