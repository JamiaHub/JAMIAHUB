import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, Send, MessageCircle, X, TrendingUp, BookOpen, Code, Lightbulb, Plus, Tag, Image, User } from 'lucide-react';
import NavBar from "./NavBar";
import { axiosInstance } from '../lib/axios';
import useAuthUser from "../hook/useAuthUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import BlogPostForm from '../components/BlogPostForm';
import { Channel , ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from  "stream-chat-react";
import { StreamChat } from 'stream-chat'
import 'stream-chat-react/dist/css/v2/index.css';

const STREAM_API_KEY =  import.meta.env.VITE_STREAM_API_KEY;

const BASE_URL = 'https://jamia-hub-backend.vercel.app/'

const Community = () => {
  const [activeTab, setActiveTab] = useState('societies');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRoom, setActiveChatRoom] = useState();
  const [message, setMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [addBtnClick, setAddbtnClick] = useState(false);
  const [error, setError]  = useState(false);
  const [loading , setLoading] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const {authUser} = useAuthUser();
  const [chatRooms, setChatrooms] = useState([]);
  const [client, setClient] = useState(null);
  const [channel  ,  setChannel] = useState(null);

  const isAuthenticated = Boolean(authUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categories = ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Other'];

  const getStreamToken = async() => {
    const response = await axiosInstance.get('/chats/token');
    return response.data;
  }

  const {data:tokenData} = useQuery({
    queryKey: ["StreamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  // Initialize Stream Chat Client
  useEffect(()=>{
    const initChat = async () => {
      if(!tokenData?.token || !authUser) {
        console.log("Cannot init chat:", { hasToken: !!tokenData?.token, hasUser: !!authUser });
        return;
      }

      try{
        console.log("Initializing stream chat client...");

        const chatClient = StreamChat.getInstance(STREAM_API_KEY); 
        await chatClient.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.name}`,
          },
          tokenData.token
        );

        setClient(chatClient);
        console.log("Stream chat client connected successfully");
      } catch(err){
        console.error("Error initializing Stream Chat:", err);
      }
    }
    initChat();

    return () => {
      if (client) {
        client.disconnectUser()
          .then(() => console.log("Stream chat client disconnected"))
          .catch(err => console.error("Error disconnecting:", err));
      }
    };
  },[tokenData, authUser])

  // Switch Channel when activeChatRoom changes
  useEffect(() => {
    const switchChannel = async () => {
      if (!client) {
        return;
      }
      
      if (!activeChatRoom) {
        setChannel(null);
        return;
      }

      try {
        console.log("Attempting to switch channel for room ID:", activeChatRoom);
        
        const activeRoom = chatRooms.find(room => room._id === activeChatRoom);
        
        if (!activeRoom) {
          return;
        }

        console.log("Found room:", activeRoom.GroupName);
        console.log("Room data:", activeRoom);

        if (!activeRoom.streamChatId) {
          console.error("No streamChatId found for room:", activeRoom.GroupName);
          return;
        }

        console.log("StreamChatId:", activeRoom.streamChatId);

        // Check if user is a member
        const isMember = activeRoom.members?.some(
          member => member === authUser?._id || member._id === authUser?._id
        );

        console.log("Is member:", isMember, "Members:", activeRoom.members);

        if (!isMember) {
          console.log("User is not a member of this room");
          setChannel(null);
          return;
        }

        console.log("Creating channel instance...");
        const channelInstance = client.channel('messaging', activeRoom.streamChatId, {
          name: activeRoom.GroupName,
        });

        console.log("Watching channel...");
        await channelInstance.watch();
        
        setChannel(channelInstance);
        console.log("Successfully switched to channel:", activeRoom.GroupName);

      } catch (err) {
        console.error("Error switching channel:", err);
        setChannel(null);
      }
    };

    switchChannel();
  }, [activeChatRoom, client, chatRooms, authUser]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalGroups: 0
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    attendees: 0,
    category: 'Technical',
    image: null,
    organizer: ''
  });

  useEffect(() => {
    if(addBtnClick) {
      toast("Please Login to Continue");
      navigate("/login");
      setAddbtnClick(false);
    }
  }, [addBtnClick, navigate]);

  useEffect(() => {
    async function fetchChatRooms(page = 1, limit = 10) {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/user/allGroups', {
          params: {
            page,
            limit
          }
        });
        
        if (response.data.success) {
          setChatrooms(response.data.groups);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching chat rooms:', err);
        setError(err.response?.data?.message || 'Failed to fetch chat rooms');
      } finally {
        setLoading(false);
      }
    }
    if (isChatOpen) {
      fetchChatRooms();
    }
  }, [isChatOpen]);
  
  // const [events, setEvents] = useState([
  //   {
  //     id: 1,
  //     title: 'Tech Fest 2024',
  //     date: '2024-11-15',
  //     time: '10:00 AM - 6:00 PM',
  //     location: 'Main Auditorium',
  //     description: 'Annual technical festival featuring hackathons, workshops, and tech talks from industry experts.',
  //     attendees: 500,
  //     category: 'Technical',
  //     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
  //     organizer: 'IEEE Student Branch'
  //   },
  //   {
  //     id: 2,
  //     title: 'Cultural Night',
  //     date: '2024-11-20',
  //     time: '7:00 PM - 11:00 PM',
  //     location: 'Open Air Theatre',
  //     description: 'Celebrate diversity with music, dance, and performances from students across all departments.',
  //     attendees: 800,
  //     category: 'Cultural',
  //     image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
  //     organizer: 'Cultural Committee'
  //   },
  //   {
  //     id: 3,
  //     title: 'Startup Pitch Competition',
  //     date: '2024-11-25',
  //     time: '2:00 PM - 5:00 PM',
  //     location: 'Innovation Lab',
  //     description: 'Present your startup ideas to industry mentors and win seed funding for your venture.',
  //     attendees: 150,
  //     category: 'Business',
  //     image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
  //     organizer: 'E-Cell JMI'
  //   },
  //   {
  //     id: 4,
  //     title: 'AI/ML Workshop',
  //     date: '2024-11-28',
  //     time: '11:00 AM - 4:00 PM',
  //     location: 'Computer Lab 3',
  //     description: 'Hands-on workshop on machine learning fundamentals and practical applications.',
  //     attendees: 100,
  //     category: 'Workshop',
  //     image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
  //     organizer: 'GDSC JMI'
  //   },
  //   {
  //     id: 5,
  //     title: 'Career Guidance Seminar',
  //     date: '2024-12-02',
  //     time: '3:00 PM - 5:00 PM',
  //     location: 'Seminar Hall',
  //     description: 'Alumni panel discussion on career paths, placements, and higher education opportunities.',
  //     attendees: 300,
  //     category: 'Seminar',
  //     image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400',
  //     organizer: 'Placement Cell'
  //   }
  // ]);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/admin/events`);
        console.log('Fetched events:', response.data);
        
        if (!response.data) {
          throw new Error('No event data returned');
        }
        
        // Sort events: upcoming first, then past events
        const sortedEvents = response.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day
          
          const isAUpcoming = dateA >= today;
          const isBUpcoming = dateB >= today;
          
          // If both are upcoming or both are past, sort by date (earliest first for upcoming, latest first for past)
          if (isAUpcoming && isBUpcoming) {
            return dateA - dateB; // Ascending (earliest upcoming first)
          } else if (!isAUpcoming && !isBUpcoming) {
            return dateB - dateA; // Descending (most recent past first)
          }
          
          // Upcoming events come before past events
          return isAUpcoming ? -1 : 1;
        });
        
        setEvents(sortedEvents);
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === "events") {
      fetchEvents();
    }
  }, [activeTab]);

  // Fetch blogs with liked status
  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/admin/blogs`);
        console.log('Fetched blogs:', response.data);
        
        if (!response.data) {
          throw new Error('No blog data returned');
        }

        const sortedBlogs = response.data.sort((a, b) => {
          return (b.likes || 0) - (a.likes || 0);
        });
        
        setBlogs(response.data);
        
        // Initialize liked blogs set based on user's likes
        const userLikedBlogs = new Set();
        response.data.forEach(blog => {
          // Assuming blog has a likedBy array or similar field
          if (blog.likedBy && blog.likedBy.includes(authUser?._id)) {
            userLikedBlogs.add(blog._id || blog.id);
          }
        });
        setLikedBlogs(userLikedBlogs);
      } catch (err) {
        setError(err.message || 'Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === "blogs") {
      fetchBlogs();
    }
  }, [activeTab, authUser]);

  const handleAddEvent = async(e) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || 
        !newEvent.description || !newEvent.organizer || !newEvent.image) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('date', newEvent.date);
      formData.append('time', newEvent.time);
      formData.append('location', newEvent.location);
      formData.append('description', newEvent.description);
      formData.append('attendees', newEvent.attendees);
      formData.append('category', newEvent.category);
      formData.append('organizer', newEvent.organizer);
      formData.append('image', newEvent.image);
      formData.append('uploadedBy', authUser._id);

      const response = await axiosInstance.post('/admin/addEvent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        
        // Refetch events to get updated list from server
        const eventsResponse = await axiosInstance.get('/admin/events');
        const sortedEvents = eventsResponse.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day
          
          const isAUpcoming = dateA >= today;
          const isBUpcoming = dateB >= today;
          
          // If both are upcoming or both are past, sort by date (earliest first for upcoming, latest first for past)
          if (isAUpcoming && isBUpcoming) {
            return dateA - dateB; // Ascending (earliest upcoming first)
          } else if (!isAUpcoming && !isBUpcoming) {
            return dateB - dateA; // Descending (most recent past first)
          }
          
          // Upcoming events come before past events
          return isAUpcoming ? -1 : 1;
        });
        setEvents(sortedEvents); // Changed from eventsResponse.data.events
        
        // Reset form
        setNewEvent({
          title: '',
          date: '',
          time: '',
          location: '',
          description: '',
          attendees: 0,
          category: 'Technical',
          image: null,
          organizer: ''
        });
        
        setTimeout(() => {
          setIsAddEventOpen(false);
          setSubmitSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to add event');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvent(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Career': <TrendingUp className="w-4 h-4" />,
      'Technical': <Code className="w-4 h-4" />,
      'Campus Life': <BookOpen className="w-4 h-4" />
    };
    return icons[category] || <Lightbulb className="w-4 h-4" />;
  };

  const societies = [
    { 
      name: "IEEE Student Branch", 
      logo: "https://media.licdn.com/dms/image/v2/C4D0BAQEKek2RstC_gg/company-logo_200_200/company-logo_200_200/0/1630537673379?e=2147483647&v=beta&t=PyfdbAOCrmwWse3YoiT_1Kpw_bIAYSntXs62wSaBhJ0",
      color: "from-blue-500/20 to-cyan-500/20", 
      border: "border-blue-400/30", 
      desc: "Technology & Innovation",
      link: "https://www.instagram.com/ieeejmi/?hl=en"
    },
    { 
      name: "Google Developer Student Clubs - JMI", 
      logo: "https://jamiagdsc.github.io/images/assets/logo.png",
      color: "from-purple-500/20 to-pink-500/20", 
      border: "border-purple-400/30", 
      desc: "Technology & Community",
      link: "https://www.instagram.com/gdg__jmi/"
    },
    { 
      name: "Web3 JMI", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxUEKbbaymIeN6mf8kYlKZedKBnqjaicuQQA&s",
      color: "from-green-500/20 to-emerald-500/20", 
      border: "border-green-400/30", 
      desc: "Programming & Development",
      link: "https://www.instagram.com/w3b__jmi/"
    },
    { 
      name: "SoarX JMI", 
      logo: "https://media.licdn.com/dms/image/v2/D4D22AQGdaUrRzu9Z2g/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1728653643770?e=2147483647&v=beta&t=q5JPkh02Qw8JoTlwmhgagWryU7Wxy4mHwTk1GKfgttA",
      color: "from-amber-500/20 to-yellow-500/20", 
      border: "border-amber-400/30", 
      desc: "Innovation & Impact",
      link: "https://www.instagram.com/soarjmi/" 
    },
    { 
      name: "The Robotics Society - JMI", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWKFOIWfTQnbl4mRm72AMxVEfq905PO2xBcA&s",
      color: "from-indigo-500/20 to-violet-500/20", 
      border: "border-indigo-400/30", 
      desc: "Robotics & AI",
      link: "https://www.instagram.com/trs.jmi/" 
    },
    { 
      name: "The American Society of Civil Engineers - JMI", 
      logo: "https://images.seeklogo.com/logo-png/42/1/asce-logo-png_seeklogo-425640.png",
      color: "from-pink-500/20 to-rose-500/20", 
      border: "border-pink-400/30", 
      desc: "Infrastructure & Engineering",
      link: "https://www.instagram.com/asce_jmi/" 
    },
    { 
      name: "The Entrepreneurship Cell - JMI", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA_mcxNFapgJ8dj3dTnQGsvBpPT9Cxmiu-mg&s",
      color: "from-teal-500/20 to-cyan-500/20", 
      border: "border-teal-400/30", 
      desc: "Startups & Business",
      link: "https://www.instagram.com/ecelljmi/?hl=en"
    },
    { 
      name: "The Marketing Society - JMI", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSefYzYasyfwulToaVBUQ4t_ugV3VLSz_vxGw&s",
      color: "from-orange-500/20 to-red-500/20", 
      border: "border-orange-400/30", 
      desc: "Branding & Strategy",
      link: "https://www.instagram.com/marksoc_jmi/?hl=en"
    },
    { 
      name: "The Jamia Review", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW_S61zEfuZovip9Gcrcp5HK5q-MP5-DBaGw&s",
      color: "from-violet-500/20 to-purple-500/20", 
      border: "border-violet-400/30", 
      desc: "Student Journalism & Commentary",
      link: "https://www.instagram.com/thejamiareview/?hl=en" 
    },
    {
      name: "Enactus JMI",
      logo: "https://media.licdn.com/dms/image/v2/D4D0BAQHOgsyn7o5hJw/company-logo_200_200/company-logo_200_200/0/1681505785411?e=2147483647&v=beta&t=n-D1an9QZin68UGxEPlnbqq3eQKGVSS3tdOOMmC-bIk",
      color: "from-sky-500/20 to-indigo-500/20",
      border: "border-sky-400/30",
      desc: "Social Impact & Entrepreneurship",
      link:  "https://www.instagram.com/enactusjmi/?hl=en"
    },
    {
      name: "TedX JMI",
      logo: "https://process.filestackapi.com/Ar1JhJgKrRMCHY5XInB1Iz/resize=width:742,fit:clip/cache=expiry:max/https://cdn.filepicker.io/api/file/zH6RcyPVSkaGyAewv3A2",
      color: "from-lime-500/20 to-green-500/20",
      border: "border-lime-400/30",
      desc: "Ideas & Inspiration",
      link: "https://www.instagram.com/tedxjmi/?hl=en"
    },
    {
      name: "American Society of Mechanical Engineers - JMI",
      logo: "https://media.licdn.com/dms/image/v2/C4D0BAQGy98iEx92Bgw/company-logo_200_200/company-logo_200_200/0/1644168627511?e=2147483647&v=beta&t=PxYD3yl-v1Y85GHizTObIPSaVnJvx7GSX3_VAu109Hk",
      color: "from-fuchsia-500/20 to-purple-500/20",
      border: "border-fuchsia-400/30",
      desc: "Mechanical Design & Innovation",
      link: "https://www.instagram.com/asme_jmi/"
    },
    {
      name: "Society of Automotive Engineers - JMI",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOpBZdpC0ZunZ5ZCE_P89yC6jgx6aaed2vsw&s",
      color: "from-yellow-500/20 to-rose-500/20",
      border: "border-yellow-400/30",
      desc: "Automotive & Mobility",
      link: "https://www.instagram.com/saejmi/"
    },
    { 
      name: "180 Degrees Consulting - JMI", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF3RYOI4icEVrQbMT4aD5p4HnVHZ-UjwqPLw&s",
      color: "from-red-500/20 to-orange-500/20", 
      border: "border-red-400/30", 
      desc: "Social Impact Consulting",
      link: "https://www.instagram.com/180dc.jmi/?hl=en" 
    },
    { 
      name: "GirlUp - JMI", 
      logo: "https://media.licdn.com/dms/image/v2/D4D0BAQGy6XWCK8pw4w/company-logo_200_200/company-logo_200_200/0/1699873845159?e=2147483647&v=beta&t=wtirhSfUNsfh55XwAgVhpb0xrXnDhm_lKI6a1O7N7UE",
      color: "from-teal-500/20 to-cyan-500/20", 
      border: "border-teal-400/30", 
      desc: "Gender Equity & Empowerment" ,
      link: "https://www.instagram.com/girlupjmi/"
    },
    { 
      name: "Cultural Council FET JMI", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZYbxmXDDpy9tMIO4QOdVFAD5etL0vRBorWQ&s",
      color: "from-green-500/20 to-emerald-500/20", 
      border: "border-green-400/30", 
      desc: "Cultural Expression & Empowerment",
      link: "https://www.instagram.com/culturalcounciljmi/"
    },
    {
      name: "Jamia Gaming Community (JGC)",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc-Z_w52ZEznBwmC5KMOYM6V-NHvnKED05kA&s",
      color: "from-sky-500/20 to-indigo-500/20",
      border: "border-sky-400/30",
      desc: "Game Development & Interactive Media",
      link: "https://www.instagram.com/jgcjmi/?hl=en"
    },
  ];

  const isEventOwner = (event) => {
  if (!authUser?._id || !event.uploadedBy) return false;
  
  const userId = authUser._id;
  const uploadedBy = event.uploadedBy;
  
  // Handle string format
  if (typeof uploadedBy === 'string') {
    return uploadedBy === userId;
  }
  
  // Handle object with _id
  if (uploadedBy._id) {
    return uploadedBy._id === userId;
  }
  
  // Handle MongoDB $oid format
  if (uploadedBy.$oid) {
    return uploadedBy.$oid === userId;
  }
  
  return false;
};

  const handleBlogSubmit = async (formData) => {
    const response = await axiosInstance.post('/admin/add-Blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.status === 200 || response.status === 201) {
      toast.success("blog added succesfully")
      // Refetch blogs
      const blogsResponse = await axiosInstance.get('/admin/blogs');
      const sortedBlogs = blogsResponse.data.sort((a, b) => {
        return (b.likes || 0) - (a.likes || 0);
      });
      setBlogs(sortedBlogs);
      setIsBlogOpen(false);
    }
  };

  const handleBlogLikeClicked = async (blogId, e) => {
    e.stopPropagation(); // Prevent opening the blog modal when clicking like
    
    if (!isAuthenticated) {
      toast("Please login to like blogs");
      navigate("/login");
      return;
    }
    
    try {
      const isLiked = likedBlogs.has(blogId);
      
      if (isLiked) {
        await axiosInstance.post(`/admin/remLike/${blogId}`);
        setLikedBlogs(prev => {
          const newSet = new Set(prev);
          newSet.delete(blogId);
          return newSet;
        });
        
        // Update the blog's like count locally
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            (blog._id || blog.id) === blogId 
              ? { ...blog, likes: blog.likes - 1 }
              : blog
          )
        );
      } else {
        await axiosInstance.post(`/admin/addLike/${blogId}`);
        setLikedBlogs(prev => new Set(prev).add(blogId));
        
        // Update the blog's like count locally
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            (blog._id || blog.id) === blogId 
              ? { ...blog, likes: blog.likes + 1 }
              : blog
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const SocietyCard = ({ society, index }) => (
    <div className="group relative flex-shrink-0 w-72 h-80 cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${society.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
      
      <div className={`relative w-full h-full bg-gradient-to-br ${society.color} backdrop-blur-xl rounded-3xl shadow-2xl border ${society.border} hover:border-opacity-60 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
        
        <div className="relative z-10 h-2/3 flex flex-col items-center justify-center p-8">
          <div className="w-28 h-28 mb-6 transform transition-all duration-500 group-hover:scale-110 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <img 
              src={society.logo} 
              alt={society.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200/6366f1/ffffff?text=' + society.name.split(' ')[0];
              }}
            />
          </div>
          <h3 className="text-white text-center font-bold text-xl leading-tight mb-3">
            {society.name}
          </h3>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-gray-300 text-center text-sm leading-relaxed">
            {society.desc}
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href={society.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 shadow-sm hover:shadow-pink-400 rounded-full text-white text-sm font-medium transition-all duration-300 backdrop-blur-sm"
            >
              Visit Instagram
            </a>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float-particle"
              style={{
                top: `${20 + i * 25}%`,
                left: `${15 + i * 30}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axiosInstance.post(`/user/groups/${groupId}/join`);
      
      if (response.data.success) {
        toast.success('Successfully joined the group!');
        
        // Refresh chat rooms to update member status
        const roomsResponse = await axiosInstance.get('/user/allGroups');
        if (roomsResponse.data.success) {
          setChatrooms(roomsResponse.data.groups);
        }
        
        // Set the newly joined room as active
        setActiveChatRoom(groupId);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error(error.response?.data?.message || 'Failed to join group');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const response = await axiosInstance.post(`/admin/delEvent/${eventId}`);
      
      if (response.status === 200) {
        toast.success('Event deleted successfully');
        // Refetch events
        const eventsResponse = await axiosInstance.get('/admin/events');
        const sortedEvents = eventsResponse.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day
          
          const isAUpcoming = dateA >= today;
          const isBUpcoming = dateB >= today;
          
          // If both are upcoming or both are past, sort by date (earliest first for upcoming, latest first for past)
          if (isAUpcoming && isBUpcoming) {
            return dateA - dateB; // Ascending (earliest upcoming first)
          } else if (!isAUpcoming && !isBUpcoming) {
            return dateB - dateA; // Descending (most recent past first)
          }
          
          // Upcoming events come before past events
          return isAUpcoming ? -1 : 1;
        });
        setEvents(sortedEvents);
        setSelectedEvent(null); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float-orb"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-float-orb animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-orb animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      <NavBar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Community Hub
          </span>
        </h1>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Connect, Learn, and Grow Together
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setActiveTab('societies')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'societies'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Student Societies
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            Events Calendar
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'blogs'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <BookOpen className="w-5 h-5 inline-block mr-2" />
            Student Blogs
          </button>
        </div>

        {/* Society section */}
        {activeTab === 'societies' && (
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 border border-white/20 hover:scale-110 -translate-x-1/2"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 border border-white/20 hover:scale-110 translate-x-1/2"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex gap-6 pb-8 px-12">
                {societies.map((society, idx) => (
                  <SocietyCard key={idx} society={society} index={idx} />
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {societies.map((_, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const cardWidth = 320;
                      scrollContainerRef.current.scrollTo({
                        left: idx * cardWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeTab === 'events' && (
          <>
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700 border-dashed">
                <Calendar className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Events Yet</h3>
                <p className="text-gray-400 mb-6">Be the first to create an event!</p>
                <button
                  onClick={() => isAuthenticated ? setIsAddEventOpen(true) : setAddbtnClick(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => {
                  // Check if event is upcoming or past
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isUpcoming = eventDate >= today;

                  return (
                    <div
                      key={event._id || event.id}
                      className="bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer transform hover:-translate-y-2"
                      onClick={() => setSelectedEvent(event)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Event Status Badge - Upcoming or Past */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs  uppercase tracking-wide shadow-lg ${
                          isUpcoming 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {event.category}
                        </div>
                        
                        {/* Delete Button - Only show to uploader */}
                        {isEventOwner(event) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event._id || event.id);
                            }}
                            className="absolute bottom-4 left-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 group"
                            title="Delete Event"
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <User className="w-4 h-4 mr-2" />
                            Organized by {event.organizer}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Users className="w-4 h-4 mr-2" />
                            {event.attendees} attending
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Blogs Section */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                className="bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedBlog(blog)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    {getCategoryIcon(blog.category)}
                    {blog.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gray-400 text-sm">{blog.author}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400 text-sm">{blog.readTime}</span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    { JSON.parse(blog.tags[0]).map((tag, i) => (
                      <span key={i} className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <button 
                      onClick={(e) => handleBlogLikeClicked(blog._id || blog.id, e)}
                      className={`flex items-center gap-1 transition-colors ${
                        likedBlogs.has(blog._id || blog.id) 
                          ? 'text-red-500' 
                          : 'hover:text-red-500'
                      }`}
                    >
                      {likedBlogs.has(blog._id || blog.id) ? '❤️' : '🤍'} {blog.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className=" top-0 z-10 relative">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-full transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  {getCategoryIcon(selectedBlog.category)}
                  {selectedBlog.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-4">{selectedBlog.title}</h1>
                
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {selectedBlog.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedBlog.author}</p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>{selectedBlog.date}</span>
                        <span>•</span>
                        <span>{selectedBlog.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-4">
                    <button 
                      onClick={(e) => handleBlogLikeClicked(selectedBlog._id || selectedBlog.id, e)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        likedBlogs.has(selectedBlog._id || selectedBlog.id)
                          ? 'bg-red-500/20 text-red-500 border border-red-500'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      {likedBlogs.has(selectedBlog._id || selectedBlog.id) ? '❤️' : '🤍'}
                      <span>{selectedBlog.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedBlog.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-700">
                  {JSON.parse(selectedBlog.tags[0]).map((tag, i) => (
                    <span key={i} className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Floating Chat Button */}
      <button
        onClick={() => isAuthenticated? setIsChatOpen(true) : setAddbtnClick(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 z-50 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {activeTab !== "societies" &&  events.length != 0 &&  (
        <button
          onClick={() => isAuthenticated? activeTab == 'events' ? setIsAddEventOpen(true) : setIsBlogOpen(true): setAddbtnClick(true)}
          className="fixed bottom-8 right-24 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 z-50 hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
      {activeTab == "blogs" &&  (
        <button
          onClick={() => isAuthenticated? setIsBlogOpen(true): setAddbtnClick(true)}
          className="fixed bottom-8 right-24 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 z-50 hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
      {/* Chat Modal */}
      {isChatOpen && isAuthenticated && client && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl">
            {/* Chat Rooms Sidebar */}
            <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Chat Rooms</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {chatRooms.map((room) => {
                const isMember = room.members?.some(
                  member => member === authUser?._id || member._id === authUser?._id
                );
                return (
                  <div key={room._id} className="mb-2 group/room relative">
                    <button
                      onClick={() => isMember && setActiveChatRoom(room._id)}
                      disabled={!isMember}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        activeChatRoom === room._id
                          ? 'bg-purple-500 text-white'
                          : isMember
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-700/30 text-gray-500 cursor-pointer hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{room.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{room.GroupName}</div>
                          <div className="text-xs opacity-70">
                            {room.totalMembers} members
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {!isMember && (
                      <button
                        onClick={() => handleJoinGroup(room._id)}
                        className="absolute inset-0 bg-blue-600/95 hover:bg-blue-700/95 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover/room:opacity-100"
                      >
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">Join Group</span>
                      </button>
                    )}
                  </div>
                );
              })}
              </div>
            <div className="flex-1 flex flex-col">
              {channel ? (
                <Chat client={client} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <ChannelHeader />
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Select a chat room to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddEventOpen && isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl">
            {/* Event Form */}
            <div className="flex-1 flex flex-col">
              {/* Form Header */}
              <div className="bg-gray-800/50 border-b border-gray-700 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Create New Event</h2>
                <button
                  onClick={() => setIsAddEventOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {submitError && (
                    <div className="mb-3 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                      {submitError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="mb-3 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
                      Event created successfully!
                    </div>
                  )}
                  {/* Title */}
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Event Title *</label>
                    <input
                      type="text"
                      name="title" 
                      value={newEvent.title}
                      onChange={handleEventInputChange}
                      placeholder="Enter event title"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date *
                      </label>
                      <input
                        type="date"
                        name='date'
                        value={newEvent.date}
                        onChange={handleEventInputChange}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time *
                      </label>
                      <input
                        type="text"
                        name='time'
                        value={newEvent.time}
                        onChange={handleEventInputChange}
                        placeholder="10:00 AM - 6:00 PM"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name='location'
                      value={newEvent.location}
                     onChange={handleEventInputChange}
                      placeholder="Enter event location"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Category and Attendees */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category *
                      </label>
                      <select
                        name='category'
                        value={newEvent.category}
                        onChange={handleEventInputChange}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Expected Attendees
                      </label>
                      <input
                        type="number"
                        name='attendees'
                        value={newEvent.attendees}
                        onChange={handleEventInputChange}
                        placeholder="0"
                        min="0"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Organizer */}
                  <div>
                    <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Organizer *
                    </label>
                    <input
                      type="text"
                      name='organizer'
                      value={newEvent.organizer}
                      onChange={handleEventInputChange}
                      placeholder="Enter organizer name"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Upload Poster Image (JPG, JPEG, PNG) *
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageFileChange}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                    />
                  </div>


                  {/* Description */}
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Description *</label>
                    <textarea
                      name='description'
                      value={newEvent.description}
                      onChange={handleEventInputChange}
                      placeholder="Describe your event..."
                      rows="4"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer - Action Buttons */}
              <div className="bg-gray-800/50 border-t border-gray-700 p-4">
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAddEventOpen(false)}
                    className="flex-1 bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBlogOpen && isAuthenticated && (
        <BlogPostForm 
              isOpen={isBlogOpen}
              onClose={() => setIsBlogOpen(false)}
              onSubmit={handleBlogSubmit}
            />
      )}
      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(30px, -40px) scale(1.1); opacity: 0.4; }
          66% { transform: translate(-30px, 30px) scale(0.9); opacity: 0.35; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .animate-float-orb { animation: float-orb 15s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Community;