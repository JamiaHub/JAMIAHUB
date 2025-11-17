import React, { useState } from 'react'
import Navbar from './NavBar'

const SPICPICalculator = () => {
  const [activeTab, setActiveTab] = useState('spi');
  
  // SPI Calculator State
  const [subjects, setSubjects] = useState([
    { name: '', credits: '', grade: '' }
  ]);
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [spiResult, setSpiResult] = useState(null);
  
  // CPI Calculator State
  const [semesters, setSemesters] = useState([
    { year: 1, semester: 1, spi: '', credits: '' },
    { year: 1, semester: 2, spi: '', credits: '' },
  ]);
  const [cpi, setCpi] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [division, setDivision] = useState(null);

  // Grade Scale
  const gradeScale = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'P': 4,
    'F': 0
  };

  // SPI Calculator Functions
  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: '', grade: '' }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const calculateSPI = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach(subject => {
      const credits = parseFloat(subject.credits);
      const gradePoint = gradeScale[subject.grade];
      
      if (!isNaN(credits) && gradePoint !== undefined && credits > 0) {
        totalCredits += credits;
        totalGradePoints += credits * gradePoint;
      }
    });

    if (totalCredits > 0) {
      const spi = (totalGradePoints / totalCredits).toFixed(2);
      setSpiResult({
        spi,
        totalCredits,
        percentage: (spi * 10).toFixed(2)
      });
    } else {
      setSpiResult(null);
    }
  };

  const resetSPI = () => {
    setSubjects([{ name: '', credits: '', grade: '' }]);
    setSpiResult(null);
    setSelectedSemester('1');
  };

  // CPI Calculator Functions
  const addSemester = () => {
    const lastSem = semesters[semesters.length - 1];
    let newYear = lastSem.year;
    let newSemester = lastSem.semester + 1;
    
    if (newSemester > 2) {
      newYear++;
      newSemester = 1;
    }
    
    if (newYear <= 4) {
      setSemesters([...semesters, { year: newYear, semester: newSemester, spi: '', credits: '' }]);
    }
  };

  const removeSemester = (index) => {
    if (semesters.length > 1) {
      const newSemesters = semesters.filter((_, i) => i !== index);
      setSemesters(newSemesters);
    }
  };

  const updateSemester = (index, field, value) => {
    const newSemesters = [...semesters];
    newSemesters[index][field] = value;
    setSemesters(newSemesters);
  };

  const calculateCPI = () => {
    const yearData = {
      1: { semesters: [], weight: 0.25 },
      2: { semesters: [], weight: 0.50 },
      3: { semesters: [], weight: 0.75 },
      4: { semesters: [], weight: 1.00 }
    };

    semesters.forEach(sem => {
      const spi = parseFloat(sem.spi);
      const credits = parseFloat(sem.credits);
      
      if (!isNaN(spi) && !isNaN(credits) && credits > 0) {
        yearData[sem.year].semesters.push({ spi, credits });
      }
    });

    let weightedSum = 0;
    let totalWeight = 0;

    for (let year = 1; year <= 4; year++) {
      const data = yearData[year];
      if (data.semesters.length > 0) {
        let yearTotalPoints = 0;
        let yearTotalCredits = 0;

        data.semesters.forEach(sem => {
          yearTotalPoints += sem.spi * sem.credits;
          yearTotalCredits += sem.credits;
        });

        const yearSPI = yearTotalCredits > 0 ? yearTotalPoints / yearTotalCredits : 0;
        weightedSum += yearSPI * data.weight;
        totalWeight += data.weight;
      }
    }

    if (totalWeight > 0) {
      const finalCPI = (weightedSum / totalWeight).toFixed(2);
      const finalPercentage = (finalCPI * 10).toFixed(2);
      
      setCpi(finalCPI);
      setPercentage(finalPercentage);
      
      if (finalCPI >= 8.5) {
        setDivision('First Division with Distinction');
      } else if (finalCPI >= 6.5) {
        setDivision('First Division');
      } else if (finalCPI < 6.5) {
        setDivision('Second Division');
      }
    } else {
      setCpi(null);
      setPercentage(null);
      setDivision(null);
    }
  };

  const resetCPI = () => {
    setSemesters([
      { year: 1, semester: 1, spi: '', credits: '' },
      { year: 1, semester: 2, spi: '', credits: '' },
    ]);
    setCpi(null);
    setPercentage(null);
    setDivision(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20">
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

      <Navbar/>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Academic Calculator
          </h1>
          <p className="text-gray-300 text-lg">Calculate your SPI & CPI with ease</p>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setActiveTab('spi')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'spi'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
              }`}
            >
              SPI Calculator
            </button>
            <button
              onClick={() => setActiveTab('cpi')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'cpi'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/50 scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
              }`}
            >
              CPI Calculator
            </button>
          </div>
        </div>

        {/* SPI Calculator */}
        {activeTab === 'spi' && (
          <div className="max-w-4xl mx-auto animate-card-appear">
            <div className=" gap-8">
              {/* Grade Scale Reference */}
              

              {/* Calculator */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl shadow-3xl border border-purple-500/20 p-8">
                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Select Semester</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="0">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>

                  <h2 className="text-2xl font-bold text-purple-300 mb-4">Enter Subject Details</h2>
                  
                  <div className="space-y-4 mb-6">
                    {subjects.map((subject, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                      >
                        <div className="grid gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Subject Name</label>
                            <input
                              type="text"
                              placeholder="e.g., Data Structures"
                              value={subject.name}
                              onChange={(e) => updateSubject(index, 'name', e.target.value)}
                              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Credits</label>
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                placeholder="e.g., 4"
                                value={subject.credits}
                                onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Grade</label>
                              <select
                                value={subject.grade}
                                onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                              >
                                <option value="">Select</option>
                                {Object.keys(gradeScale).map(grade => (
                                  <option key={grade} value={grade}>{grade}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {subjects.length > 1 && (
                            <button
                              onClick={() => removeSubject(index)}
                              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-3 py-2 transition-all duration-300"
                            >
                              Remove Subject
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <button
                      onClick={addSubject}
                      className="flex-1 min-w-[150px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                    >
                      + Add Subject
                    </button>
                    
                    <button
                      onClick={calculateSPI}
                      className="flex-1 min-w-[150px] bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50"
                    >
                      Calculate SPI
                    </button>
                    
                    <button
                      onClick={resetSPI}
                      className="flex-1 min-w-[150px] bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Reset
                    </button>
                  </div>

                  {spiResult && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-2xl p-6 text-center animate-bounce-in">
                      <h3 className="text-gray-300 text-lg mb-2">Semester Performance Index (SPI)</h3>
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {spiResult.spi}
                      </div>
                      <div className="text-xl text-gray-400 mb-1">
                        Total Credits: {spiResult.totalCredits}
                      </div>
                      <div className="text-2xl font-semibold text-yellow-400">
                        {spiResult.percentage}%
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-purple-300 mb-3">How SPI is Calculated:</h3>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li>• <strong>SPI</strong> = Σ(Credits × Grade Points) ÷ Σ Credits</li>
                    <li>• Each grade has a point value (O=10, A+=9, A=8, etc.)</li>
                    <li>• Multiply each subject's credits by its grade points</li>
                    <li>• Sum all products and divide by total credits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CPI Calculator */}
        {activeTab === 'cpi' && (
          <div className="max-w-4xl mx-auto animate-card-appear">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl shadow-3xl border border-purple-500/20 p-8">
              <div className="space-y-4 mb-6">
                <h2 className="text-2xl font-bold text-purple-300 mb-4">Enter Semester Performance Index (SPI)</h2>
                
                {semesters.map((semester, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <span className="text-purple-400 font-bold text-lg">
                          Year {semester.year} - Sem {semester.semester === 1 ? 'I' : 'II'}
                        </span>
                        <div className="text-xs text-gray-500">
                          Weight: {semester.year === 1 ? '25%' : semester.year === 2 ? '50%' : semester.year === 3 ? '75%' : '100%'}
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">SPI (0-10)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            placeholder="e.g., 8.5"
                            value={semester.spi}
                            onChange={(e) => updateSemester(index, 'spi', e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Credits</label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            placeholder="e.g., 24"
                            value={semester.credits}
                            onChange={(e) => updateSemester(index, 'credits', e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                      </div>
                      
                      {semesters.length > 1 && (
                        <button
                          onClick={() => removeSemester(index)}
                          className="flex-shrink-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-3 py-2 transition-all duration-300 hover:scale-105"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={addSemester}
                  disabled={semesters.length >= 8}
                  className="flex-1 min-w-[150px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Semester
                </button>
                
                <button
                  onClick={calculateCPI}
                  className="flex-1 min-w-[150px] bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50"
                >
                  Calculate CPI
                </button>
                
                <button
                  onClick={resetCPI}
                  className="flex-1 min-w-[150px] bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Reset
                </button>
              </div>

              {cpi !== null && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-2xl p-6 text-center animate-bounce-in">
                  <h3 className="text-gray-300 text-lg mb-2">Cumulative Performance Index (CPI)</h3>
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {cpi}
                  </div>
                  <div className="text-2xl font-semibold text-yellow-400 mb-2">
                    {percentage}%
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {division}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-purple-300 mb-3">How CPI is Calculated:</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• <strong>Year Weights</strong>: Year 1 (25%), Year 2 (50%), Year 3 (75%), Year 4 (100%)</li>
                <li>• <strong>CPI</strong>: Weighted average of yearly SPIs based on year weights</li>
                <li>• <strong>Percentage</strong>: Y% = 10 × CPI</li>
                <li>• <strong>Division</strong>: Distinction (CPI ≥ 8.5), I Division (6.5-8.5), II Division (≤ 6.4)</li>
              </ul>
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

export default SPICPICalculator;