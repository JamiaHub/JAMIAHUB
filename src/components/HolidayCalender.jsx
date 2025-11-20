import { useState, useEffect } from "react";

const HolidayCalendar = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Reset to current month when calendar opens
  useEffect(() => {
    if (isOpen) {
      setCurrentDate(new Date());
    }
  }, [isOpen]);
  
  // Predefined holidays list
  const holidays = {
    '2025-01-26': true,
    '2025-02-26': true,
    '2025-03-13': true,
    '2025-03-14': true,
    '2025-03-28': true,
    '2025-03-31': true,
    '2025-04-06': true,
    '2025-04-10': true,
    '2025-04-18': true,
    '2025-05-12': true,
    '2025-06-07': true,
    '2025-06-08': true,
    '2025-07-06': true,
    '2025-07-07': true,
    '2025-08-14': true,
    '2025-08-15': true,
    '2025-08-16': true,
    '2025-09-05': true,
    '2025-10-01': true,
    '2025-10-02': true,
    '2025-10-19': true,
    '2025-10-20': true,
    '2025-11-05': true,
    '2025-12-25': true,
  };
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };
  
  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Holiday Calendar</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className={`text-center text-sm font-semibold py-2 ${
                index === 0 ? 'text-red-400' : index === 6 ? 'text-red-400' : 'text-purple-300'
              }`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isHoliday = holidays[dateKey];
              const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;
              
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    isToday(day)
                      ? 'bg-blue-400 text-white ring-2 ring-blue-400'
                      : isHoliday
                      ? 'bg-green-400 text-white'
                      : isSunday
                      ? 'bg-red-900/40 text-red-300 border border-red-500/30'
                      : isSaturday
                      ? 'bg-red-900/40 text-red-300 border border-red-500/30'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-400"></div>
              <span className="text-gray-300">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-400"></div>
              <span className="text-gray-300">Holiday</span>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-gray-400 text-center">
            Holidays are marked according to the Jamia Annual Calendar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;