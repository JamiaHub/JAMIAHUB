import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";

const Home = () => {
  const navigate = useNavigate();
  const branches = [
    "CSE",
    "ECE",
    "Electrical",
    "Mechanical",
    "Civil",
    "CS-DS",
    "ECE-VLSI",
    "Electrical & Computer",
  ];

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [branchSelect, setBranchSelect] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showSemOptions, setShowSemOptions] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleBranchClick = (branch) => {
    setBranchSelect(true);
    setSelectedBranch(branch);
    setShowSemOptions(true);
  };

  const handleSemSelect = (sem) => {
    setShowSemOptions(false);
    setBranchSelect(false);
    setSelectedBranch("");
    navigate(
      `/resources?branch=${encodeURIComponent(selectedBranch)}&sem=${encodeURIComponent(
        sem
      )}`
    );
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submitting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactForm.email || !emailRegex.test(contactForm.email)) {
      setEmailError("Please enter a valid email address");
      setSubmitStatus("error");
      return;
    }

    // Validate name
    if (!contactForm.name.trim()) {
      setSubmitStatus("error");
      return;
    }

    // Validate message
    if (!contactForm.message.trim()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axiosInstance.post("/user/connect", contactForm);

      if (response.status === 201) {
        setSubmitStatus("success");
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGameClick = (game) => {
    navigate(`/games?gameName=${encodeURIComponent(game)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
  };

  const games = [
    { name: "Sudoku", icon: "🔢", color: "from-emerald-600 to-teal-600" },
    { name: "Memory", icon: "🧠", color: "from-blue-600 to-cyan-600" },
    { name: "Chess", icon: "♟️", color: "from-purple-600 to-indigo-600" },
    { name: "Tic-Tac-Toe", icon: "❌", color: "from-pink-600 to-rose-600" },
    { name: "Mini Coding Game", icon: "💻", color: "from-orange-600 to-amber-600" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Fixed gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      </div>

      {/* Moving gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float-orb"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-float-orb animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-orb animation-delay-4000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl animate-float-orb animation-delay-3000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Animated stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Animated light rays */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-purple-500 via-transparent to-transparent animate-ray-1"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-pink-500 via-transparent to-transparent animate-ray-2"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-blue-500 via-transparent to-transparent animate-ray-3"></div>
      </div>

      <NavBar />

      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col-reverse xl:flex-row items-center justify-between lg:px-12 px-4 py-8 gap-8 relative">
        <div className="z-40 xl:mb-0 mb-8 w-full xl:w-1/2">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold z-10 text-center xl:text-left text-white/90 animate-slide-up">
            Welcome to
          </h1>
          <h1 className="text-4xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mb-6 animate-gradient text-center xl:text-left mt-2">
            Jamia Hub
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mb-6 text-center xl:text-left animate-slide-up animation-delay-200 leading-relaxed">
            Your gateway to the vibrant Jamia Millia Islamia community. Connect,
            collaborate, and thrive with resources, events, and support tailored
            for students.
          </p>
        </div>

        {/* 3D Animated Logo */}
        <div className="z-40 flex items-center justify-center w-full xl:w-1/2 h-[220px] md:h-[300px] xl:h-[400px] animate-slide-up animation-delay-400">
          <div className="relative">
            <svg
              viewBox="0 0 300 300"
              width="100%"
              height="100%"
              className="drop-shadow-2xl animate-float-3d max-w-xs md:max-w-md xl:max-w-lg"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse
                cx="150"
                cy="150"
                rx="100"
                ry="100"
                fill="url(#grad1)"
                opacity="0.8"
                filter="url(#glow)"
              />
              <ellipse
                cx="150"
                cy="150"
                rx="60"
                ry="60"
                fill="#0f0f1e"
                opacity="0.9"
              />
              <ellipse
                cx="150"
                cy="150"
                rx="40"
                ry="40"
                fill="url(#grad1)"
                opacity="0.9"
                filter="url(#glow)"
              />
              <circle cx="210" cy="110" r="8" fill="#fff" opacity="0.9">
                <animate
                  attributeName="r"
                  values="8;16;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="min-h-[40vh] w-full relative overflow-auto flex flex-col items-center justify-center lg:px-12 px-4 py-12">
        <div className="z-40 w-full max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold mb-12 text-white text-center animate-slide-up">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Resources By Branch
            </span>
          </h2>

          {/* Hexagonal/Staggered Layout */}
          <div className="relative flex flex-wrap justify-center gap-6 mt-5">
            {branches.map((branch, idx) => {
              const colors = [
                {
                  from: "from-purple-500/20",
                  to: "to-violet-600/20",
                  glow: "shadow-purple-500/50",
                  border: "border-purple-400/30",
                  hover: "hover:border-purple-400/60",
                },
                {
                  from: "from-pink-500/20",
                  to: "to-rose-600/20",
                  glow: "shadow-pink-500/50",
                  border: "border-pink-400/30",
                  hover: "hover:border-pink-400/60",
                },
                {
                  from: "from-blue-500/20",
                  to: "to-cyan-600/20",
                  glow: "shadow-blue-500/50",
                  border: "border-blue-400/30",
                  hover: "hover:border-blue-400/60",
                },
                {
                  from: "from-emerald-500/20",
                  to: "to-teal-600/20",
                  glow: "shadow-emerald-500/50",
                  border: "border-emerald-400/30",
                  hover: "hover:border-emerald-400/60",
                },
                {
                  from: "from-orange-500/20",
                  to: "to-amber-600/20",
                  glow: "shadow-orange-500/50",
                  border: "border-orange-400/30",
                  hover: "hover:border-orange-400/60",
                },
                {
                  from: "from-indigo-500/20",
                  to: "to-blue-600/20",
                  glow: "shadow-indigo-500/50",
                  border: "border-indigo-400/30",
                  hover: "hover:border-indigo-400/60",
                },
                {
                  from: "from-fuchsia-500/20",
                  to: "to-purple-600/20",
                  glow: "shadow-fuchsia-500/50",
                  border: "border-fuchsia-400/30",
                  hover: "hover:border-fuchsia-400/60",
                },
                {
                  from: "from-cyan-500/20",
                  to: "to-sky-600/20",
                  glow: "shadow-cyan-500/50",
                  border: "border-cyan-400/30",
                  hover: "hover:border-cyan-400/60",
                },
              ];

              const color = colors[idx % colors.length];

              return (
                <div
                  key={branch}
                  className={`group relative w-44 h-44 md:w-52 md:h-52 transition-all duration-500 cursor-pointer animate-card-appear ${
                    branchSelect && selectedBranch !== branch
                      ? "blur-sm opacity-30 scale-90 pointer-events-none"
                      : "hover:scale-110 hover:-translate-y-2"
                  } ${
                    branchSelect && selectedBranch === branch
                      ? "z-50 scale-110 -translate-y-2"
                      : ""
                  }`}
                  style={{
                    animationDelay: `${idx * 0.08}s`,
                    transform:
                      idx % 2 === 0 ? "translateY(20px)" : "translateY(0)", // Staggered effect
                  }}
                  onClick={() => !branchSelect && handleBranchClick(branch)}
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${color.glow}`}
                  ></div>

                  {/* Main card */}
                  <div
                    className={`relative w-full h-full bg-gradient-to-br ${color.from} ${color.to} backdrop-blur-xl rounded-3xl shadow-2xl border ${color.border} ${color.hover} transition-all duration-500 overflow-hidden`}
                  >
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-border-flow"></div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6">
                      {/* Icon/Symbol */}
                      <div className="mb-4 text-4xl md:text-5xl font-bold text-white/80 group-hover:text-white  duration-300 group-hover:scale-110 transform transition-all">
                        {branch.split("").slice(0, 2).join("")}
                      </div>

                      {/* Branch name */}
                      <h3 className="text-white text-center font-bold text-sm md:text-base leading-tight group-hover:scale-105 transform transition-transform">
                        {branch}
                      </h3>

                      {/* Floating particles inside card */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float-particle"
                            style={{
                              top: `${20 + i * 30}%`,
                              left: `${20 + i * 25}%`,
                              animationDelay: `${i * 0.5}s`,
                              animationDuration: `${3 + i}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Sem selection overlay */}
                    {showSemOptions &&
                      branchSelect &&
                      selectedBranch === branch && (
                        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black/95 backdrop-blur-2xl rounded-3xl animate-scale-in z-20 p-4 border-2 border-purple-400/70 shadow-2xl shadow-purple-500/50">
                          <div className="w-full flex flex-col items-center justify-center h-full">
                            <div className="text-sm md:text-base font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              Select Semester
                            </div>
                            <div className="grid grid-cols-4 gap-3 w-full px-2">
                              {["1", "2", "3", "4", "5", "6", "7", "8"].map(
                                (semester, i) => (
                                  <button
                                    key={semester}
                                    className="px-2 py-2 text-sm rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:scale-110 hover:shadow-purple-500/60 transition-all duration-300 animate-bounce-in border border-white/30"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSemSelect(semester); // Make sure to define this handler
                                    }}
                                  >
                                    {semester}
                                  </button>
                                )
                              )}
                            </div>
                            <button
                              className="mt-4 text-xs text-gray-400 hover:text-white transition-colors duration-300 underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSemOptions(false);
                                setBranchSelect(false);
                                setSelectedBranch("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Games & Contact Section */}
      <section className="min-h-[40vh] w-full flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:px-12 px-4 py-8">
        {/* Games Section - Modern Cards */}
        <div className="z-40 w-full max-w-2xl mx-auto animate-slide-up">
          <h2 className="text-center text-2xl lg:text-3xl font-semibold mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Games & Puzzles
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {games.map((game, idx) => (
              <div
                key={game.name}
                className="group perspective-1000 animate-card-appear"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => handleGameClick(game.name)}
              >
                <div className="relative w-40 h-52 cursor-pointer transition-all duration-500 transform-style-3d hover:rotate-y-6 hover:-translate-y-2">
                  {/* Card front */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${game.color} rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 p-6 flex flex-col items-center justify-center transition-all duration-500 group-hover:shadow-3xl`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                    {/* Icon */}
                    <div className="text-6xl mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                      {game.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-center font-bold text-sm leading-tight">
                      {game.name}
                    </h3>

                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form - Modern Glass Card */}
        <div className="z-40 w-full max-w-md mx-auto animate-slide-up animation-delay-200">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-transparent"></div>

            {/* Glass overlay */}
            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-center text-2xl lg:text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Contact Us
              </h2>

              <div className="space-y-5">
                <div className="animate-slide-up animation-delay-300">
                  <label className="block text-white/90 mb-2 text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-gray-900/50 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div className="animate-slide-up animation-delay-400">
                  <label className="block text-white/90 mb-2 text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      emailError ? "border-red-500/60" : "border-white/20"
                    } focus:outline-none focus:ring-2 ${
                      emailError
                        ? "focus:ring-red-500/50"
                        : "focus:ring-gray-900/50"
                    } bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-400">{emailError}</p>
                  )}
                </div>

                <div className="animate-slide-up animation-delay-500">
                  <label className="block text-white/90 mb-2 text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-gray-900/50 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300 resize-none "
                    placeholder="Your message here..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                {submitStatus === "success" && (
                  <div className="text-green-400 text-center text-sm">
                    Message sent successfully!
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="text-red-400 text-center text-sm">
                    Failed to send message. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleConnectSubmit}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-pink-700 to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-800 hover:scale-105 group animate-slide-up animation-delay-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float-orb {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% { 
            transform: translate(30px, -40px) scale(1.1);
            opacity: 0.4;
          }
          66% { 
            transform: translate(-30px, 30px) scale(0.9);
            opacity: 0.35;
          }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes ray-1 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateX(20px) scaleY(1.2);
            opacity: 0.6;
          }
        }
        
        @keyframes ray-2 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.4;
          }
          50% { 
            transform: translateX(-20px) scaleY(1.3);
            opacity: 0.7;
          }
        }
        
        @keyframes ray-3 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.35;
          }
          50% { 
            transform: translateX(15px) scaleY(1.15);
            opacity: 0.65;
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-3d {
          0%, 100% { transform: translateY(0) rotateZ(0deg); }
          50% { transform: translateY(-20px) rotateZ(5deg); }
        }
        
        @keyframes card-appear {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes border-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.4;
          }
          50% { 
            transform: translate(10px, -15px); 
            opacity: 0.8;
          }
        }
        
        .animate-float-orb { animation: float-orb 15s ease-in-out infinite; }
        .animate-ray-1 { animation: ray-1 8s ease-in-out infinite; }
        .animate-ray-2 { animation: ray-2 10s ease-in-out infinite; }
        .animate-ray-3 { animation: ray-3 9s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-float-3d { animation: float-3d 6s ease-in-out infinite; }
        .animate-card-appear { animation: card-appear 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out forwards; }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-border-flow { animation: border-flow 2s linear infinite; }
        .animate-float-particle { animation: float-particle 4s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-6:hover { transform: rotateY(6deg); }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.5); }
      `}</style>
    </div>
  );
};

export default Home;