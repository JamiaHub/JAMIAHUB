import React, { useState } from 'react';
import { X, Image, Sparkles, Hash, Camera, Send } from 'lucide-react';
import useAuthUser from '../hook/useAuthUser';

export default function BlogPostForm({ isOpen, onClose, onSubmit }) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Mock auth user
  const {authUser} = useAuthUser();

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: authUser.name,
    category: 'Career',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    image: null,
    tags: []
  });

  const blogCategories = ['Career', 'Technical', 'Campus Life', 'Study Tips', 'Placement', 'Research'];

  const handleBlogInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBlog(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !newBlog.tags.includes(currentTag.trim())) {
      setNewBlog(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newBlog.title || !newBlog.author || !newBlog.category || 
        !newBlog.excerpt || !newBlog.content || !newBlog.image) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('author', newBlog.author);
      formData.append('category', newBlog.category);
      formData.append('excerpt', newBlog.excerpt);
      formData.append('content', newBlog.content);
      formData.append('tags', JSON.stringify(newBlog.tags));
      formData.append('image', newBlog.image);
      formData.append('date',newBlog.date);
      formData.append('likes', newBlog.likes);

      await onSubmit(formData);
      
      setSubmitSuccess(true);
      
      setNewBlog({
        title: '',
        author: authUser.name,
        category: 'Career',
        excerpt: '',
        content: '',
        image: null,
        likes: 0,
        tags: []
      });
      setImagePreview(null);
      
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create blog post');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-black/60 to-blue-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-purple-500/20">
        {/* Modern Header with Gradient */}
        <div className="relative p-6 bg-gradient-to-r from-purple-600  to-blue-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create Blog Post</h2>
                <p className="text-purple-100 text-sm">Share your knowledge & experiences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-900 to-black">
          {/* Alerts */}
          {submitError && (
            <div className="p-4 bg-red-500/20 backdrop-blur-sm border-l-4 border-red-500 rounded-r-xl text-red-300">
              <p className="font-semibold">⚠️ {submitError}</p>
            </div>
          )}
          {submitSuccess && (
            <div className="p-4 bg-green-500/20 backdrop-blur-sm border-l-4 border-green-500 rounded-r-xl text-green-300">
              <p className="font-semibold">✨ Blog post published successfully!</p>
            </div>
          )}

          {/* Card Style Post Creator */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-5 shadow-xl">
            {/* Author Section */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-700/50">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500  to-violet-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {authUser.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="author"
                  value={newBlog.author}
                  onChange={handleBlogInputChange}
                  className="w-full bg-transparent text-white font-bold text-xl focus:outline-none mb-1"
                  placeholder="Your name"
                />
                <div className="flex items-center gap-2">
                  <select
                    name="category"
                    value={newBlog.category}
                    onChange={handleBlogInputChange}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white text-sm px-4 py-1.5 rounded-full border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-700 backdrop-blur-sm"
                  >
                    {blogCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <span className="text-gray-500 text-xs">• Just now</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <input
                type="text"
                name="title"
                value={newBlog.title}
                onChange={handleBlogInputChange}
                placeholder="✨ Give your blog an amazing title..."
                className="w-full bg-transparent text-white text-2xl font-bold focus:outline-none placeholder:text-gray-600 leading-tight"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
              <textarea
                name="excerpt"
                value={newBlog.excerpt}
                onChange={handleBlogInputChange}
                placeholder="🎯 Hook your readers with a compelling summary..."
                rows="2"
                maxLength="200"
                className="w-full bg-transparent text-gray-300 focus:outline-none resize-none placeholder:text-gray-500 text-sm leading-relaxed"
              />
              <div className="text-right text-gray-500 text-xs mt-2">
                {newBlog.excerpt.length}/200
              </div>
            </div>

            {/* Main Content */}
            <div>
              <textarea
                name="content"
                value={newBlog.content}
                onChange={handleBlogInputChange}
                placeholder="📝 Write your blog content... Share your insights, tips, and experiences with the community!"
                rows="8"
                className="w-full bg-transparent text-white text-lg focus:outline-none resize-none placeholder:text-gray-600 leading-relaxed"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setNewBlog(prev => ({ ...prev, image: null }));
                  }}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Tags Display */}
            {newBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {newBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="group bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:from-pink-500/30 hover:to-purple-500/30 transition-all"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="opacity-60 group-hover:opacity-100 hover:text-red-400 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Tags Input */}
            <div className="flex gap-2 pt-2">
              <div className="flex-1 relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tags to reach more people..."
                  className="w-full bg-gray-800/50 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg shadow-purple-500/30"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <div className="p-5 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  name="image"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleBlogImageChange}
                  className="hidden"
                />
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-xl transition-all border border-blue-500/30 group">
                  <Camera className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={submitLoading}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all font-semibold disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:shadow-2xl hover:shadow-purple-500/50 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Publish Blog
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}