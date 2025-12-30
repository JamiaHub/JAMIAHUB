import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Edit2, Save, X, User, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hook/useAuthUser";
import { axiosInstance } from "../lib/axios";

const ProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    studentId: authUser?.studentId || "",
    branch: authUser?.branch || "",
    sem: authUser?.sem || "",
    gender: authUser?.gender || "",
    phoneNumber: authUser?.phoneNumber || "",
    dateOfBirth: authUser?.dateOfBirth || "",
    bio: authUser?.bio || "",
    avatar: null,
  });

  const branches = ["CSE", "ECE", "ME", "CE", "EE", "CS-DS", "VLSI", "EE-CE"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const genders = ["Male", "Female", "Prefer not to say"];

  // Avatar styles for random generation
  const avatarStyles = [
    "adventurer",
    "avataaars",
    "big-ears",
    "big-smile",
    "bottts",
    "croodles",
    "fun-emoji",
    "icons",
    "identicon",
    "lorelei",
    "micah",
    "miniavs",
    "open-peeps",
    "personas",
    "pixel-art",
  ];

  const generateRandomAvatar = () => {
    const randomStyle =
      avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const seed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
  };

  // Update profile mutation
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();

      if (data.name) formDataToSend.append("name", data.name);
      if (data.studentId) formDataToSend.append("studentId", data.studentId);
      if (data.branch) formDataToSend.append("branch", data.branch);
      if (data.sem) formDataToSend.append("sem", data.sem);
      if (data.gender) formDataToSend.append("gender", data.gender);
      if (data.phoneNumber)
        formDataToSend.append("phoneNumber", data.phoneNumber);
      if (data.dateOfBirth)
        formDataToSend.append("dateOfBirth", data.dateOfBirth);
      if (data.bio) formDataToSend.append("bio", data.bio);
      if (data.avatar) formDataToSend.append("avatar", data.avatar);

      const response = await axiosInstance.put(
        "/user/profile",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setAvatarPreview(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setShowAvatarModal(false);
    }
  };

  const handleRandomAvatar = async () => {
    const avatarUrl = generateRandomAvatar();
    setAvatarPreview(avatarUrl);
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      const file = new File([blob], "avatar.svg", { type: "image/svg+xml" });
      setFormData((prev) => ({ ...prev, avatar: file }));
      setShowAvatarModal(false);
      toast.success("Random avatar generated!");
    } catch (error) {
      toast.error("Failed to generate avatar");
    }
  };

  const handleSubmit = () => {
    updateProfile(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: authUser?.name || "",
      email: authUser?.email || "",
      studentId: authUser?.studentId || "",
      branch: authUser?.branch || "",
      sem: authUser?.sem || "",
      gender: authUser?.gender || "",
      phoneNumber: authUser?.phoneNumber || "",
      dateOfBirth: authUser?.dateOfBirth || "",
      bio: authUser?.bio || "",
      avatar: null,
    });
    setAvatarPreview(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-b from-gray-900 to-black border border-purple-500/20 rounded-2xl overflow-hidden">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  {avatarPreview || authUser?.avatar ? (
                    <img
                      src={avatarPreview || authUser?.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 rounded-full p-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                    {authUser?.name || "Not set"}
                  </p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-gray-400 flex items-center gap-2">
                  {authUser?.email}
                  {authUser?.isVerified && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </p>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Student ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your student ID"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                    {authUser?.studentId || "Not set"}
                  </p>
                )}
              </div>

              {/* Gender and Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                      {authUser?.gender || "Not set"}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 1234567890"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                      {authUser?.phoneNumber || "Not set"}
                    </p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                    {authUser?.dateOfBirth
                      ? new Date(authUser.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not set"}
                  </p>
                )}
              </div>

              {/* Branch and Semester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  {isEditing ? (
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                      {authUser?.branch || "Not set"}
                    </p>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Semester
                  </label>
                  {isEditing ? (
                    <select
                      name="sem"
                      value={formData.sem}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white">
                      {authUser?.sem ? `Semester ${authUser.sem}` : "Not set"}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-800/50 rounded-lg text-white min-h-[100px]">
                    {authUser?.bio || "No bio added yet"}
                  </p>
                )}
              </div>

              {/* Account Info */}
              <div className="pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Account Created:</span>
                    <p className="text-white mt-1">
                      {authUser?.createdAt &&
                        new Date(authUser.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Onboarding Status:</span>
                    <p className="text-white mt-1">
                      {authUser?.isOnboarded ? (
                        <span className="text-green-400">✓ Completed</span>
                      ) : (
                        <span className="text-yellow-400">⚠ Pending</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-purple-500/20 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Choose Avatar Method
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Random Avatar Option */}
              <button
                onClick={handleRandomAvatar}
                className="w-full p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-white font-semibold mb-1">
                      Generate Random Avatar
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Get a unique AI-generated avatar
                    </p>
                  </div>
                </div>
              </button>

              {/* Upload from File Option */}
              <label
                htmlFor="avatar-file-upload"
                className="w-full p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-xl transition-all group cursor-pointer block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-white font-semibold mb-1">
                      Upload from Device
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Choose an image from your files
                    </p>
                  </div>
                </div>
                <input
                  id="avatar-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;