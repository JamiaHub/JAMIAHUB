import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import NavBar from "../pages/NavBar";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: passwords.newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        "Password reset successfully! Please login with your new password."
      );
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to reset password");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    resetPassword();
  };

  return (
    <div className="min-h-screen relative overflow-hidden" data-theme="forest">
      {/* Background animations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float-orb"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-float-orb animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-orb animation-delay-4000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl animate-float-orb animation-delay-3000"></div>
      </div>

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

      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-purple-500 via-transparent to-transparent animate-ray-1"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-pink-500 via-transparent to-transparent animate-ray-2"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-blue-500 via-transparent to-transparent animate-ray-3"></div>
      </div>

      <NavBar />

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-transparent backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-400 p-8 border border-base-300">
            <h2 className="text-3xl font-bold text-center mb-2">
              Reset Password
            </h2>
            <p className="text-center text-base-content/60 mb-6">
              Enter your new password
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="input input-bordered w-full pr-10"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Confirm Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="input input-bordered w-full pr-10"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-6"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-base-content/60">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Back to Login
              </a>
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
        
        .animate-float-orb { animation: float-orb 15s ease-in-out infinite; }
        .animate-ray-1 { animation: ray-1 8s ease-in-out infinite; }
        .animate-ray-2 { animation: ray-2 10s ease-in-out infinite; }
        .animate-ray-3 { animation: ray-3 9s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
