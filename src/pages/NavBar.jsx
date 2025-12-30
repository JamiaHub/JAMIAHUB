import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import HolidayCalendar from "../components/HolidayCalender";
import { Calendar } from "lucide-react";
import useAuthUser from "../hook/useAuthUser";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const location = useLocation();
  const shouldShowAuthButton =
    location.pathname !== "/login" && location.pathname !== "/signup";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem("jwt");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("You are successfully logged out");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      localStorage.removeItem("jwt");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out");
      navigate("/login");
    },
  });

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logoutMutate();
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black border-b border-purple-500/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                JamiaHub
              </span>
            </Link>

            
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/community"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/community")
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Community
              </Link>
              <Link
                to="/resources"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/resources")
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Resources
              </Link>
              <Link
                to="/cgpa"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/cgpa-calculator")
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                CGPA Calculator
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/about")
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                About Us
              </Link>
            </div>

            
            <div className="flex items-center space-x-3">
              {/* Calendar Button */}
              <button
                onClick={() => setCalendarOpen(true)}
                className="p-2 rounded-lg bg-black transition-all duration-300 hover:scale-105 focus:outline-none ring-1 ring-purple-400/50 hover:ring-2"
                title="Holiday Calendar"
              >
                <Calendar className="w-5 h-5 text-purple-400" />
              </button>

              
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {authUser?.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ring-2 ring-purple-400/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                      {authUser?.name?.[0]?.toUpperCase() ||
                        authUser?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                  <span className="text-sm text-gray-300 font-medium">
                    {authUser?.name || authUser?.email || "Profile"}
                  </span>
                </Link>
              )}

              {shouldShowAuthButton && (
                <button
                  onClick={handleAuthAction}
                  disabled={isLoading}
                  className="hidden md:block relative px-5 py-2 text-white text-sm font-semibold rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 group-hover:scale-105 transition-transform duration-300" />
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
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                aria-label="menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 z-50 shadow-2xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Menu
          </h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            aria-label="close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col p-6 space-y-2">
          <Link
            to="/"
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/")
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">🏠</span>
            <span className="font-medium">Home</span>
            {isActive("/") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </Link>

          <Link
            to="/community"
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/community")
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">👥</span>
            <span className="font-medium">Community</span>
            {isActive("/community") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </Link>

          <Link
            to="/resources"
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/resources")
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">📚</span>
            <span className="font-medium">Resources</span>
            {isActive("/resources") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </Link>

          <Link
            to="/cgpa"
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/cgpa-calculator")
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">🧮</span>
            <span className="font-medium">CGPA Calculator</span>
            {isActive("/cgpa-calculator") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </Link>

          <Link
            to="/about"
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/about")
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg">ℹ️</span>
            <span className="font-medium">About Us</span>
            {isActive("/about") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </Link>
        </nav>

        {/* Auth Button */}
        {shouldShowAuthButton && (
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={() => {
                handleAuthAction();
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className="w-full relative px-6 py-3 text-white font-semibold rounded-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 group-hover:scale-105 transition-transform duration-300" />
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
            </button>
          </div>
        )}
      </div>

      {/* Holiday Calendar Modal */}
      <HolidayCalendar
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />
    </>
  );
};

export default NavBar;
