import React, {useState} from 'react'
import NavBar from "./NavBar";
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import profilePic from '../assets/profilePic.jpeg'


const about = () => {
  const teamMember = {
    name: "Mahtab Madni",
    image: profilePic,
    description:
      "Hi, I'm Mahtab Madni — a passionate Web Developer and Artificial Intelligence Enthusiast dedicated to crafting innovative solutions that make a meaningful impact. Driven by curiosity and a love for learning, I continuously explore emerging technologies and creative approaches to problem-solving. I believe in the power of collaboration and knowledge-sharing to help communities grow, thrive, and succeed together.",
    branch: "ECE (2028)",
    linkedin: "https://www.linkedin.com/in/mahtab-madni-391364327",
    instagram: "https://www.instagram.com/itz_mahtab25?igsh=ZmZvMmswcHEzcGU%3D",
    github: "https://github.com/Mahtab-Madni",
  };

  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submitting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactForm.email || !emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address");
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
      const response = await axiosInstance.post("/user/feedback", formData);

      // Axios uses response.status, not response.ok
      if (response.status === 201) {
        setSubmitStatus("success");
        setFormData({ email: "", message: "" }); // Reset form
        toast.success("Feedback submitted");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* About Section */}
        <section className="mb-20">
          <h1 className="text-5xl font-bold text-white text-center mb-12">
            About This Website
          </h1>

          <div className="max-w-5xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 shadow-2xl">
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              JamiaHub is a student-powered academic platform built by and for
              the vibrant community of Jamia Millia Islamia. Our mission is to
              create a unified space where students can easily access and share
              essential study resources, fostering a culture of collaboration
              and support. From detailed notes and previous year question papers
              (PYQs) to curated study guides and peer-contributed materials,
              JamiaHub brings everything you need under one roof. Whether you're
              prepping for exams or diving deeper into your coursework, this hub
              is designed to make your academic journey smoother and more
              connected.
            </p>

            <p className="text-gray-200 text-lg leading-relaxed">
              This platform also features a CGPA calculator to help you track
              your academic performance, group chats for real-time
              collaboration, blog writing tools to share insights and
              experiences, an event calendar to stay updated on campus
              happenings, and fun games to take a break from studying. We're
              constantly working to improve and expand JamiaHub, adding new
              features that support and empower our vibrant community.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Meet The Creator
          </h2>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-10 md:p-12 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
              {/* Profile Image */}
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                  <img
                    src={teamMember.image}
                    alt={teamMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-4xl font-bold text-blue-400 text-center mb-6">
                {teamMember.name}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-center text-lg leading-relaxed mb-8">
                {teamMember.description}
              </p>

              {/* Branch */}
              <p className="text-gray-400 text-center font-semibold text-lg mb-8">
                <span className="text-white">Branch:</span> {teamMember.branch}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-8">
                <a
                  href={teamMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href={teamMember.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={teamMember.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729  1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.042.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .317.216.687.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="mt-24">
          <h2 className="text-4xl font-bold text-white text-center mb-10">
            Share Your Feedback
          </h2>

          <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-10 md:p-12 border border-gray-700 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    emailError ? "border-red-500/60" : "border-gray-600"
                  } focus:outline-none focus:ring-2 ${
                    emailError
                      ? "focus:ring-red-500/50"
                      : "focus:ring-purple-500"
                  } bg-gray-900 backdrop-blur-xl text-white transition-all duration-300`}
                  placeholder="you@example.com"
                  required
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-400">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="We'd love to hear your thoughts..."
                  required
                ></textarea>
              </div>

              {submitStatus === "success" && (
                <div className="text-green-400 text-center">
                  Thank you for your feedback!
                </div>
              )}

              {submitStatus === "error" && (
                <div className="text-red-400 text-center">
                  Something went wrong. Please try again.
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </section>
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
  );
}

export default about;