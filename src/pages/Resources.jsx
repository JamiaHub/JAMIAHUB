import React from "react";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import useAuthUser from "../hook/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Resources = () => {
  const [sem, setSem] = useState("");
  const [branch, setBranch] = useState("");
  const [sub, setSub] = useState("");
  const [subType , setsubType]  = useState("");
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjectFormOpen , setSubjectFormOpen] = useState(false);
  const [resourceFormOpen , setResourceFormOpen] = useState(false);
  const [selectedSubjectType, setSelectedSubjectType] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [addBtnClick, setAddbtnClick] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isResourceTypeSel, setIsResourceTypeSel] = useState(false);
  const [resourceType, setResourceType] = useState('');
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {authUser} = useAuthUser();

  const isAuthenticated = Boolean(authUser);

  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    branch: '',
    sem: '',
    type: ''
  });

  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    subjectCode: '',
    branch: '',
    sem: '',
    type: '',
    link:''
  });


  const handleSubjectFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const response = await axiosInstance.post('/admin/add-subjects', subjectFormData);
      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        // Reset form
        setSubjectFormData({
          name: '',
          code: '',
          branch: '',
          sem: '',
          type: ''
        });
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          setSubjectFormOpen(false);
          setSubmitSuccess(false);
          // Refresh subjects list if on the same branch/sem
          if (subjectFormData.branch === branch && subjectFormData.sem === sem) {
            window.location.reload();
          }
        }, 1500);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to add subject');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleResourceFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const response = await axiosInstance.post('/admin/add-resource', resourceFormData);
      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        // Reset form
        setResourceFormData({
          title: '',
          subjectCode: '',
          branch: '',
          sem: '',
          type: '',
          link:''
        });
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          setResourceFormOpen(false);
          setSubmitSuccess(false);
          // Refresh subjects list if on the same branch/sem
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to add subject');
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if(addBtnClick) {
      toast("Please Login to add new resources");
      navigate("/login");
      setAddbtnClick(false);
    }
  }, [addBtnClick, navigate]);

  // Handle form input changes
  const handleSubjectFormChange = (field, value) => {
    setSubjectFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }
    try {
      await axiosInstance.post(`/admin/delete-resource/${resourceId}`);
      // Refresh resources or remove from state
      queryClient.invalidateQueries(['resources']);
      toast.success('Resource deleted successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete resource');
      console.error(error);
    }
  };

  const handleResourceFormChange = (field, value) => {
    setResourceFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // If navigated with sem/branch params, show only isSubmitted content
  useEffect(() => {
    const urlBranch = searchParams.get("branch");
    const urlSem = searchParams.get("sem");
    if (urlBranch && urlSem) {
      setBranch(decodeURIComponent(urlBranch));
      setSem(decodeURIComponent(urlSem));
      setIsSubmitted(true);
    } else if (urlBranch) {
      setBranch(decodeURIComponent(urlBranch));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchSubjects() {
      setLoading(true);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['subjects', branch, sem],
          queryFn: async () => {
            const response = await axiosInstance.get(`/admin/subjects?branch=${branch}&sem=${sem}`);
            return response.data.subjects; // assuming response shape is { subjects: [...] }
          },
        });
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (isSubmitted) {
      fetchSubjects();
    }
  }, [branch, sem, isSubmitted]);

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['resources', branch, sem, sub],
          queryFn: async () => {
            const response = await axiosInstance.get(`/admin/get-Resources?branch=${branch}&sem=${sem}&sub=${sub}&type=${resourceType}`);
            return response.data.resources; // assuming response shape is { subjects: [...] }
          },
        });
        setResources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (isResourceTypeSel) {
      fetchResources();
    }
  }, [branch, sem, sub, resourceType, isResourceTypeSel]);

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
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
        {/* Only show form if not submitted (i.e. direct from NavBar, not via URL) */}
        {!isSubmitted && (
          <div className="w-full max-w-5xl mx-auto mt-10 px-4 relative z-10">
            {!branch ? (
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">Select Your Branch</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { code: 'CSE', name: 'Computer Science', icon: '💻' },
                    { code: 'ECE', name: 'Electronics & Communication', icon: '📡' },
                    { code: 'ME', name: 'Mechanical', icon: '⚙️' },
                    { code: 'CE', name: 'Civil', icon: '🏗️' },
                    { code: 'EE', name: 'Electrical', icon: '⚡' },
                    { code: 'VLSI', name: 'VLSI Design', icon: '🔬' },
                    { code: 'CS-DS', name: 'CS - Data Science', icon: '📊' },
                    { code: 'EE-CS', name: 'Electrical & Computer', icon: '🔌' }
                  ].map((branchItem, index) => (
                    <button
                      key={branchItem.code}
                      onClick={() => setBranch(branchItem.code)}
                      className="group relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500" />
                      <div className="relative z-10 text-center">
                        <div className="text-4xl mb-3">{branchItem.icon}</div>
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                          {branchItem.code}
                        </h3>
                        <p className="text-sm text-white/60">{branchItem.name}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Select Semester for {branch}</h2>
                  <button
                    onClick={() => { setBranch(''); setSem(''); }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-xl border border-white/20"
                  >
                    Change Branch
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((semester, index) => (
                    <button
                      key={semester}
                      onClick={() => {
                        setSem(semester.toString());
                        navigate(`/resources?branch=${encodeURIComponent(branch)}&sem=${encodeURIComponent(semester)}`);
                      }}
                      className="group relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-blue-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 cursor-pointer"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500" />
                      <div className="relative z-10 text-center">
                        <div className="text-5xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                          {semester}
                        </div>
                        <p className="text-sm text-white/60">Semester</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* show subject type selection if submitted */}
        {isSubmitted && !selectedSubjectType && !isSubjectSelected && (
          <div className="w-full max-w-4xl mx-auto mt-10 px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Select Subject Type
                </h2>
                <p className="text-white/70">Choose between Theory or Practical subjects</p>
              </div>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSem('');
                  navigate(`/resources`);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-xl border border-white/20 flex items-center gap-2 whitespace-nowrap ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setSelectedSubjectType('Theory')}
                className="group relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-blue-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-500" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">Theory Subjects</h3>
                  <p className="text-white/60">View all theoretical subjects</p>
                </div>
              </div>
              
              <div 
                onClick={() => setSelectedSubjectType('Practical')}
                className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">Practical Subjects</h3>
                  <p className="text-white/60">View all practical subjects</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* show subjects if type selected */}
        {isSubmitted && selectedSubjectType && !isSubjectSelected && ( 
          <div className="w-full max-w-6xl mx-auto mt-10 px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {branch} - Sem {sem} - {selectedSubjectType} Subjects
                </h2>
                <p className="text-white/70">Click on any subject to view resources</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubjectType('');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-xl border border-white/20 flex items-center gap-2 whitespace-nowrap ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-pulse"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10"></div>
                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                      </div>
                      <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2 mb-1"></div>
                      <div className="h-4 bg-white/10 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : subjects.filter(subject => subject.type === selectedSubjectType).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
                {subjects.filter(subject => subject.type === selectedSubjectType).map((subject, index) => (
                  <div key={index} className="group relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer animate-resources-card" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => {
                      setIsSubjectSelected(true);
                      setSub(subject.code);
                      setsubType(subject.type);
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">{index + 1}</div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">{subject.name || subject}</h3>
                      <p className="text-white/60 text-sm">{subject.code || `Subject ${index + 1}`}</p>
                      <p className="text-white/60 text-sm">{subject.type}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <p className="text-white text-lg">No {selectedSubjectType} subjects available for {branch} - Sem {sem}</p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Show Resources Types After subject is selected */}
        {isSubjectSelected && !isResourceTypeSel && (
          <div className="w-full max-w-6xl mx-auto mt-10 px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Select Resource Type
                </h2>
                <p className="text-white/70">Choose the type of resource you want to access for {sub}</p>
              </div>
              <button
                onClick={() => {
                  setIsSubjectSelected(false);
                  setSub('');
                  setsubType('');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-xl border border-white/20 flex items-center gap-2 whitespace-nowrap ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Subjects
              </button>
            </div>

            {subType === "Theory" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => {
                    setResourceType('Notes');
                    setIsResourceTypeSel(true);
                  }}
                  className="group relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">Notes</h4>
                    <p className="text-white/60">Access comprehensive study notes and summaries</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                <div 
                  onClick={() => {
                    setResourceType('PYQs');
                    setIsResourceTypeSel(true);
                  }}
                  className="group relative bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">PYQs</h4>
                    <p className="text-white/60">Previous year questions for practice</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                <div 
                  onClick={() => {
                    setResourceType('Books');
                    setIsResourceTypeSel(true);
                  }}
                  className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">Books</h4>
                    <p className="text-white/60">Recommended textbooks and reference materials</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            )}

            {subType === "Practical" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => {
                    setResourceType('LabManuals');
                    setIsResourceTypeSel(true);
                  }}
                  className="group relative bg-gradient-to-br from-orange-600/20 to-amber-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.586V5L7 4z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">Lab Manuals</h4>
                    <p className="text-white/60">Step-by-step lab experiment guides</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                <div 
                  onClick={() => {
                    setResourceType('VideoLinks');
                    setIsResourceTypeSel(true);
                  }}
                  className="group relative bg-gradient-to-br from-red-600/20 to-rose-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-red-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-rose-500/0 group-hover:from-red-500/10 group-hover:to-rose-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">Video Tutorials</h4>
                    <p className="text-white/60">Watch practical demonstrations</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                <div 
                  onClick={() => {
                    setResourceType('LabWorks');
                    setIsResourceTypeSel(true);
                  }}
                  className="group relative bg-gradient-to-br from-teal-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-teal-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.586V5L7 4z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors duration-300">Lab Works</h4>
                    <p className="text-white/60">Sample experiment works</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            )}
          </div>
        )}
        {/* Display Resources List */}
        {isResourceTypeSel && (
          <div className="w-full max-w-6xl mx-auto mt-10 px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {resourceType} - {sub}
                </h2>
                <p className="text-white/70">{branch} | Semester {sem}</p>
              </div>
              <button
                onClick={() => {
                  setIsResourceTypeSel(false);
                  setResourceType('');
                  setResources([]);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-xl border border-white/20 flex items-center gap-2 whitespace-nowrap ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Types
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-pulse"
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/10"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-indigo-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={resource.link || resource.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          
                          {authUser && resource.uploadedBy && authUser._id === resource.uploadedBy && (
                            <button
                              onClick={() => handleDeleteResource(resource._id || resource.id)}
                              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-all duration-300 group/delete"
                              title="Delete resource"
                            >
                              <svg className="w-5 h-5 text-red-400 group-hover/delete:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                        {resource.title || resource.name || `Resource ${index + 1}`}
                      </h3>
                      {resource.subjectCode && (
                        <p className="text-white/60 text-sm mb-3">{resource.subjectCode}</p>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-white text-lg">No {resourceType.toLowerCase()} available yet</p>
                  <p className="text-white/60 text-sm mt-2">Be the first to contribute!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button to Add Resources */}
        {isSubmitted &&  (
          <button
            onClick={() => {isAuthenticated? setShowAddModal(true) : setAddbtnClick(true)}}
            className="fixed bottom-8 right-8 z-50 group"
            aria-label="Add new resource"
          >
            <div className="relative">
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-75 group-hover:opacity-100 animate-resources-pulse" />
              
              {/* Main button */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
          </button>
        )}
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-resources-modal-bg">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <div className="relative bg-transparent backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-resources-modal">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 group"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
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

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Add New Resource</h3>
                <p className="text-white/60 text-sm">Choose what you'd like to add</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSubjectFormOpen(true);
                  }}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                        Add New Subject
                      </h4>
                      <p className="text-sm text-white/60">Create a new subject category</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setResourceFormOpen(true);
                  }}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                        Add Resources
                      </h4>
                      <p className="text-sm text-white/60">Upload notes, PDFs, or links</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {subjectFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-resources-modal-bg">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSubjectFormOpen(false)}
            />
            <div className="relative bg-transparent backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-resources-modal max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSubjectFormOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 group"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
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

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Add New Subject</h3>
                <p className="text-white/60 text-sm">Fill in the details to create a new subject</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubjectFormSubmit}>
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-xl">
                    <p className="text-red-200 text-sm">{submitError}</p>
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 backdrop-blur-xl">
                    <p className="text-green-200 text-sm">Subject added successfully!</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="subjectName" className="block text-sm font-medium text-white/90">
                    Subject Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    required
                    value={subjectFormData.name}
                    onChange={(e) => handleSubjectFormChange('name', e.target.value)}
                    placeholder="e.g., Data Structures and Algorithms"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectCode" className="block text-sm font-medium text-white/90">
                    Subject Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="subjectCode"
                    required
                    value={subjectFormData.code}
                    onChange={(e) => handleSubjectFormChange('code', e.target.value)}
                    placeholder="e.g., CS201"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectBranch" className="block text-sm font-medium text-white/90">
                    Branch <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjectBranch"
                    required
                    value={subjectFormData.branch}
                    onChange={(e) => handleSubjectFormChange('branch', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  >
                    <option value="" disabled selected className="bg-gray-800">
                      Select branch
                    </option>
                    <option value="CSE" className="bg-gray-800">CSE</option>
                    <option value="ECE" className="bg-gray-800">ECE</option>
                    <option value="ME" className="bg-gray-800">ME</option>
                    <option value="CE" className="bg-gray-800">CE</option>
                    <option value="EE" className="bg-gray-800">EE</option>
                    <option value="VLSI" className="bg-gray-800">VLSI</option>
                    <option value="CS-DS" className="bg-gray-800">CS-DS</option>
                    <option value="EE-CS" className="bg-gray-800">EE-CS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectSem" className="block text-sm font-medium text-white/90">
                    Semester <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjectSem"
                    required
                    value={subjectFormData.sem}
                    onChange={(e) => handleSubjectFormChange('sem', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  >
                    <option value="" disabled selected className="bg-gray-800">
                      Select Semester
                    </option>
                    <option value="1" className="bg-gray-800">1st Sem</option>
                    <option value="2" className="bg-gray-800">2nd Sem</option>
                    <option value="3" className="bg-gray-800">3rd Sem</option>
                    <option value="4" className="bg-gray-800">4th Sem</option>
                    <option value="5" className="bg-gray-800">5th Sem</option>
                    <option value="6" className="bg-gray-800">6th Sem</option>
                    <option value="7" className="bg-gray-800">7th Sem</option>
                    <option value="8" className="bg-gray-800">8th Sem</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectType" className="block text-sm font-medium text-white/90">
                    Subject Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjectType"
                    required
                    value={subjectFormData.type}
                    onChange={(e) => handleSubjectFormChange('type', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  >
                    <option value="" disabled selected className="bg-gray-800">
                      Select type
                    </option>
                    <option value="Theory" className="bg-gray-800">Theory</option>
                    <option value="Practical" className="bg-gray-800">Practical</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSubjectFormOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {resourceFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-resources-modal-bg">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setResourceFormOpen(false)}
            />
            <div className="relative bg-transparent backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 animate-resources-modal max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setResourceFormOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 group"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
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

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Add New Resource</h3>
                <p className="text-white/60 text-sm">Fill in the details to create a new resource</p>
              </div>

              <form className="space-y-5" onSubmit={handleResourceFormSubmit}>
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-xl">
                    <p className="text-red-200 text-sm">{submitError}</p>
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 backdrop-blur-xl">
                    <p className="text-green-200 text-sm">Resource added successfully!</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="subjectCode" className="block text-sm font-medium text-white/90">
                    Subject Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="subjectCode"
                    required
                    value={resourceFormData.subjectCode}
                    onChange={(e) => handleResourceFormChange('subjectCode', e.target.value)}
                    placeholder="e.g., CS201"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="resTitle" className="block text-sm font-medium text-white/90">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="resTitle"
                    required
                    value={resourceFormData.title}
                    onChange={(e) => handleResourceFormChange('title', e.target.value)}
                    placeholder="e.g., Unit 1"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectBranch" className="block text-sm font-medium text-white/90">
                    Branch <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjectBranch"
                    required
                    value={resourceFormData.branch}
                    onChange={(e) => handleResourceFormChange('branch', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  >
                    <option value="" disabled selected className="bg-gray-800">
                      Select branch
                    </option>
                    <option value="CSE" className="bg-gray-800">CSE</option>
                    <option value="ECE" className="bg-gray-800">ECE</option>
                    <option value="ME" className="bg-gray-800">ME</option>
                    <option value="CE" className="bg-gray-800">CE</option>
                    <option value="EE" className="bg-gray-800">EE</option>
                    <option value="VLSI" className="bg-gray-800">VLSI</option>
                    <option value="CS-DS" className="bg-gray-800">CS-DS</option>
                    <option value="EE-CS" className="bg-gray-800">EE-CS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectSem" className="block text-sm font-medium text-white/90">
                    Semester <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjectSem"
                    required
                    value={resourceFormData.sem}
                    onChange={(e) => handleResourceFormChange('sem', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  >
                    <option value="" disabled selected className="bg-gray-800">
                      Select Semester
                    </option>
                    <option value="1" className="bg-gray-800">1st Sem</option>
                    <option value="2" className="bg-gray-800">2nd Sem</option>
                    <option value="3" className="bg-gray-800">3rd Sem</option>
                    <option value="4" className="bg-gray-800">4th Sem</option>
                    <option value="5" className="bg-gray-800">5th Sem</option>
                    <option value="6" className="bg-gray-800">6th Sem</option>
                    <option value="7" className="bg-gray-800">7th Sem</option>
                    <option value="8" className="bg-gray-800">8th Sem</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectType" className="block text-sm font-medium text-white/90">
                    Resource Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subjectType"
                    required
                    value={resourceFormData.type}
                    onChange={(e) => handleResourceFormChange('type', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  >
                    <option value="" disabled selected className="bg-gray-800">
                      Select type
                    </option>
                    <option value="Notes" className="bg-gray-800">Notes</option>
                    <option value="PYQs" className="bg-gray-800">PYQs</option>
                    <option value="VideoLinks" className="bg-gray-800">Video Links</option>
                    <option value="Books" className="bg-gray-800">Books</option>
                    <option value="LabWorks" className="bg-gray-800">Lab Works</option>
                    <option value="LabManuals" className="bg-gray-800">Lab Manual</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subjectName" className="block text-sm font-medium text-white/90">
                    Link <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    required
                    value={resourceFormData.link}
                    onChange={(e) => handleResourceFormChange('link', e.target.value)}
                    placeholder="e.g., https://www.drive.google.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 bg-white/10 backdrop-blur-xl text-white placeholder-white/40 transition-all duration-300"
                  />
                  <p className="text-xs text-white/70 pl-2">
                    First upload your resource to Google Drive, then paste its shareable link here.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResourceFormOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
        @keyframes resources-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        @keyframes resources-card {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes resources-modal-bg {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes resources-modal {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
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
        .animate-resources-pulse { animation: resources-pulse 2s ease-in-out infinite; }
        .animate-resources-card { animation: resources-card 0.6s ease-out forwards; }
        .animate-resources-modal-bg { animation: resources-modal-bg 0.3s ease-out forwards; }
        .animate-resources-modal { animation: resources-modal 0.4s ease-out forwards; }
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

export default Resources;
