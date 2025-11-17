import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from "react-hot-toast";
import { axiosInstance } from '../lib/axios';
import HolidayCalendar from "../components/HolidayCalender";
import { Calendar } from "lucide-react";
import useAuthUser from "../hook/useAuthUser";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const location = useLocation();
  const shouldShowAuthButton = location.pathname !== '/login' && location.pathname !== '/signup';
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { mutate: logoutMutate } = useMutation({
    mutationFn: async() => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]})
      toast.success("You are Successfully logged out");
      navigate("/")
    }
  })
  
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logoutMutate()
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 shadow-2xl rounded-b-2xl relative backdrop-blur-2xl border-b-4 border-purple-500/50 animate-fade-in z-50">
        <Link to="/" className="tracking-wide drop-shadow-lg text-2xl lg:text-3xl font-extrabold text-white select-none logo-gradient-text">
          JamiaHub
        </Link>
        
        <ul
          className={`md:flex md:space-x-8 text-lg font-semibold absolute md:static top-16 left-0 w-full md:w-auto bg-black/95 md:bg-transparent shadow-xl md:shadow-none rounded-b-xl md:rounded-none transition-all duration-500 ease-in-out backdrop-blur-xl ${
            menuOpen ? "block animate-slide-down" : "hidden md:block"
          }`}
          style={{
            boxShadow: menuOpen
              ? "0 8px 32px 0 rgba(99,102,241,0.25)"
              : undefined,
          }}
        >
          <li>
            <Link
              to="/"
              className={`group relative transition duration-300 animate-fade-in block py-3 px-4 md:py-0 md:px-0 ${
                isActive('/') 
                  ? 'text-purple-400 font-bold' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Home
              <span className={`absolute left-0 md:left-auto md:right-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 ${
                isActive('/') 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/community"
              className={`group relative transition duration-300 animate-fade-in block py-3 px-4 md:py-0 md:px-0 ${
                isActive('/community') 
                  ? 'text-purple-400 font-bold' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Community
              <span className={`absolute left-0 md:left-auto md:right-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 ${
                isActive('/community') 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/resources"
              className={`group relative transition duration-300 animate-fade-in block py-3 px-4 md:py-0 md:px-0 ${
                isActive('/resources') 
                  ? 'text-purple-400 font-bold' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Resources
              <span className={`absolute left-0 md:left-auto md:right-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 ${
                isActive('/resources') 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/cgpa"
              className={`group relative transition duration-300 animate-fade-in block py-3 px-4 md:py-0 md:px-0 ${
                isActive('/cgpa') 
                  ? 'text-purple-400 font-bold' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              CGPA Calculator
              <span className={`absolute left-0 md:left-auto md:right-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 ${
                isActive('/cgpa') 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`group relative transition duration-300 animate-fade-in block py-3 px-4 md:py-0 md:px-0 ${
                isActive('/about') 
                  ? 'text-purple-400 font-bold' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              About Us
              <span className={`absolute left-0 md:left-auto md:right-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 ${
                isActive('/about') 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </li>
          
          {shouldShowAuthButton && (
            <li className="md:hidden px-4 py-3">
              <button
                onClick={() => {
                  handleAuthAction();
                  setMenuOpen(false);
                }}
                disabled={isLoading}
                className="w-full relative px-6 py-2.5 text-white font-semibold rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={`absolute inset-0 ${
                  isAuthenticated 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                } transition-transform duration-300 group-hover:scale-105`}></span>
                <span className={`absolute inset-0 ${
                  isAuthenticated 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600' 
                    : 'bg-gradient-to-r from-pink-600 to-purple-600'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isAuthenticated ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </>
                  )}
                </span>
                <span className={`absolute inset-0 rounded-lg ring-2 ${
                  isAuthenticated 
                    ? 'ring-red-400/50' 
                    : 'ring-purple-400/50'
                } opacity-0 group-hover:opacity-100 group-hover:ring-4 transition-all duration-300`}></span>
              </button>
            </li>
          )}
        </ul>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCalendarOpen(true)}
            className="p-2 rounded-lg bg-black transition-all duration-300 hover:scale-105 focus:outline-none ring-1 ring-purple-400/50 hover:ring-2"
            title="Holiday Calendar"
          >
            <Calendar className="w-5 h-5 text-white" />
          </button>

          {isAuthenticated && (
            <div className="relative group">
              <button
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 hover:border-pink-500 transition-all duration-300 cursor-pointer ring-2 ring-purple-500/30 hover:ring-pink-500/50 hover:scale-110 focus:outline-none"
              >
                {authUser?.avatar ? (
                  <img 
                    src={authUser.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover bg-white"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </button>
              
              <div className="absolute top-12 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg border border-purple-500/30">
                {authUser?.name || authUser?.email || 'Profile'}
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 border-l border-t border-purple-500/30 transform rotate-45"></div>
              </div>
            </div>
          )}

          {shouldShowAuthButton && (
            <button
              onClick={handleAuthAction}
              disabled={isLoading}
              className="hidden md:block relative px-6 py-2.5 text-white font-semibold rounded-lg overflow-hidden group animate-fade-in disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={`absolute inset-0 ${
                isAuthenticated 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              } transition-transform duration-300 group-hover:scale-105`}></span>
              <span className={`absolute inset-0 ${
                isAuthenticated 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></span>
              <span className="relative z-10 flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </>
                )}
              </span>
              <span className={`absolute inset-0 rounded-lg ring-2 ${
                isAuthenticated 
                  ? 'ring-red-400/50' 
                  : 'ring-purple-400/50'
              } opacity-0 group-hover:opacity-100 group-hover:ring-4 transition-all duration-300`}></span>
            </button>
          )}

          <button
            className="md:hidden text-white focus:outline-none hover:scale-110 transition-transform relative z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="menu"
          >
            <span
              className={`block w-5 h-0.5 rounded-full bg-gray-100 mb-1 transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 rounded-full bg-gray-100 mb-1 transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 rounded-full bg-gray-100 transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
        
        <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
          @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: none; } }
          .animate-fade-in { animation: fade-in 0.7s ease; }
          .animate-slide-down { animation: slide-down 0.5s ease; }
          .logo-gradient-text {
            background: linear-gradient(90deg, #a78bfa 30%, #6366f1 70%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
          }
        `}</style>
      </nav>
      
      <HolidayCalendar isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </>
  );
};

export default NavBar;