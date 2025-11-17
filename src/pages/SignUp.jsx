import React, { useEffect } from 'react'
import { useState } from 'react'
import NavBar from './NavBar'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router'

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    sem: "",
  })

  const queryClient = useQueryClient()
  const {mutate, isPending, error} = useMutation({
    mutationFn: async() => {
      const response = await axiosInstance.post("/auth/signup", signUpData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]})
      toast.success("Account Created Succesfully");
      navigate("/login");
    }
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    mutate()
  }

  return (
    <div className="min-h-screen relative overflow-hidden" data-theme="forest">
      {/* Cool animated colored background graphics */}
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
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
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
      {/* sign up content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-transparent backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-400 p-8 border border-base-300">
            <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
            <p className="text-center text-base-content/60 mb-6">Join us today</p>

            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error.response.data.message}</span>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Branch</span>
                </label>
                <select className="select select-bordered w-full"
                  value={signUpData.branch}
                  onChange={(e) => setSignUpData({...signUpData, branch: e.target.value})}>
                  <option >Select your branch</option>
                  <option value={"CSE"}>Computer Science</option>
                  <option value={"ECE"}>Electronics & Communication</option>
                  <option value={"CE"}>Civil Engineering</option>
                  <option value={"ME"}>Mechanical Engineering</option>
                  <option value={"EE"}>Electrical Engineering</option>
                  <option value={"CS-DS"}>Computer Science - Data Science</option>
                  <option value={"VLSI"}>Electronics & VLSI</option>
                  <option value={"EE-CE"}>Electrical & Computer</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Semester</span>
                </label>
                <select className="select select-bordered w-full"
                  value={signUpData.sem}
                  onChange={(e) => setSignUpData({...signUpData, sem: e.target.value})}>
                  <option >Select your semester</option>
                  <option value={"1"}>1st Semester</option>
                  <option value={"2"}>2nd Semester</option>
                  <option value={"3"}>3rd Semester</option>
                  <option value={"4"}>4th Semester</option>
                  <option value={"5"}>5th Semester</option>
                  <option value={"6"}>6th Semester</option>
                  <option value={"7"}>7th Semester</option>
                  <option value={"8"}>8th Semester</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-6">
                {isPending ? "Signing up..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-base-content/60">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
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
  )
}

export default SignUp