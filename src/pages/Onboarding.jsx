import React from 'react'
import NavBar from './NavBar'
import toast from "react-hot-toast"
import { useNavigate } from 'react-router'
import { useQueryClient,useMutation } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import useAuthUser from '../hook/useAuthUser'

const Onboarding = () => {
  const navigate = useNavigate();
  const authUser = useAuthUser();
  const [onboardingData, setOnboardingData] = useState({
    name: authUser?.name || "",
    branch: authUser?.branch || "",
    sem: authUser?.sem || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.avatar || "",
  })
  
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async() => {
      const response = await axiosInstance.post("/auth/onboarding", onboardingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]})
      
      navigate("/")
    }
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    mutate();
  }
  return (
    <div className="min-h-screen relative overflow-hidden" data-theme="forest">
      {/* Cool animated colored background graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-2xl animate-cgpa-sphere1" />
        <div className="absolute bottom-10 right-20 w-56 h-56 rounded-full bg-gradient-to-tr from-blue-400 via-purple-600 to-pink-500 opacity-30 blur-3xl animate-cgpa-sphere2" />
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 opacity-20 blur-2xl animate-cgpa-sphere3"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>
      <NavBar />
      {/* onboarding content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-transparent backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-400 p-8 border border-base-300">
            <h2 className="text-3xl font-bold text-center mb-2">Complete your profile</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
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
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-6">
                {isPending ? "Please wait a moment..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cgpa-sphere1 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(30px) scale(1.1); } }
        @keyframes cgpa-sphere2 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-40px) scale(1.15); } }
        @keyframes cgpa-sphere3 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes cgpa-star1 { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5) rotate(20deg); } }
        @keyframes cgpa-star2 { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(2) rotate(-15deg); } }
        @keyframes cgpa-star3 { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.8) rotate(30deg); } }
        @keyframes cgpa-star4 { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3) rotate(-10deg); } }
        .animate-cgpa-sphere1 { animation: cgpa-sphere1 6s ease-in-out infinite alternate; }
        .animate-cgpa-sphere2 { animation: cgpa-sphere2 8s ease-in-out infinite alternate; }
        .animate-cgpa-sphere3 { animation: cgpa-sphere3 7s ease-in-out infinite alternate; }
        .animate-cgpa-star1 { animation: cgpa-star1 2.5s ease-in-out infinite alternate; }
        .animate-cgpa-star2 { animation: cgpa-star2 3.2s ease-in-out infinite alternate; }
        .animate-cgpa-star3 { animation: cgpa-star3 2.8s ease-in-out infinite alternate; }
        .animate-cgpa-star4 { animation: cgpa-star4 3.5s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );

}

export default Onboarding