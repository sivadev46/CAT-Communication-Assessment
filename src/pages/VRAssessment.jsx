import React, { useState, useEffect, useMemo } from 'react';
import {
  Glasses,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  User,
  MessageSquare,
  Activity,
  Award,
  ArrowLeft,
  Check,
  Save,
  Info,
  Layers,
  Box
} from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';

// Mock VR Scenarios Dataset
const vrScenarios = [
  {
    id: 'clinic',
    name: 'Clinic Visit',
    difficulty: 'Easy',
    difficultyBadge: 'bg-emerald-100 text-emerald-800',
    description: 'Structured 1-on-1 evaluation room with minimal sensory distractions for baseline testing.',
    prompt: 'The clinician says: "Eleanor, please look at me and hand me the red building block from the desk."',
    avatarName: 'Eleanor (Patient)',
    avatarStatus: 'Gaze directed toward clinician (Sustained)',
    bgGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    objects: ['Red Building Block', 'Assessment Desk', 'Visual Board', 'Therapy Mirror'],
    targetBehavior: 'Eye Contact & Instruction Following',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'classroom',
    name: 'Classroom Environment',
    difficulty: 'Medium',
    difficultyBadge: 'bg-blue-100 text-blue-800',
    description: 'Simulated group learning setting with teacher verbal cues and subtle ambient noise.',
    prompt: 'The teacher says: "Class, please look up at the whiteboard and open your blue reading books."',
    avatarName: 'Eleanor (Patient)',
    avatarStatus: 'Tracking teacher gesture to whiteboard',
    bgGradient: 'from-teal-600 via-emerald-700 to-slate-900',
    objects: ['Blue Reading Book', 'Whiteboard', 'Student Desk', 'Wall Clock'],
    targetBehavior: 'Joint Attention & Group Listening',
    iconBg: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'playground',
    name: 'Playground Social',
    difficulty: 'Challenging',
    difficultyBadge: 'bg-amber-100 text-amber-800',
    description: 'Dynamic outdoor social setting with peer turn-taking and active visual stimuli.',
    prompt: 'A peer asks: "Do you want to play catch with the yellow ball or go to the swing set?"',
    avatarName: 'Eleanor (Patient)',
    avatarStatus: 'Turning torso toward speaking peer',
    bgGradient: 'from-amber-600 via-orange-700 to-slate-900',
    objects: ['Yellow Ball', 'Swing Set', 'Park Bench', 'Sandpit'],
    targetBehavior: 'Social Interaction & Expressive Choice',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'home',
    name: 'Home Environment',
    difficulty: 'Easy',
    difficultyBadge: 'bg-emerald-100 text-emerald-800',
    description: 'Familiar living room setting evaluating caregiver communication and daily routines.',
    prompt: 'Caregiver says: "Can you help set the table by bringing the blue cup to the dining counter?"',
    avatarName: 'Eleanor (Patient)',
    avatarStatus: 'Shared gaze between caregiver & object',
    bgGradient: 'from-purple-600 via-indigo-800 to-slate-900',
    objects: ['Blue Cup', 'Dining Counter', 'Family Photo', 'Living Room Sofa'],
    targetBehavior: 'Joint Attention & Functional Routine',
    iconBg: 'bg-purple-100 text-purple-700',
  },
];

export default function VRAssessment() {
  // Mode: 'selection' | 'simulation'
  const [mode, setMode] = useState('selection');
  
  // Current active scenario index (0 to 3)
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Interactive clicked object in VR canvas
  const [selectedObject, setSelectedObject] = useState(null);

  // Observation recording local state for each scenario
  const [observations, setObservations] = useState({
    clinic: { eyeContact: true, jointAttention: true, instructions: true, socialInteraction: true, notes: '' },
    classroom: { eyeContact: true, jointAttention: true, instructions: false, socialInteraction: true, notes: '' },
    playground: { eyeContact: false, jointAttention: true, instructions: false, socialInteraction: false, notes: '' },
    home: { eyeContact: true, jointAttention: true, instructions: true, socialInteraction: true, notes: '' },
  });

  // Summary Modal state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Active scenario object
  const currentScenario = vrScenarios[currentScenarioIndex];

  // Timer interval effect when simulation is running
  useEffect(() => {
    let interval = null;
    if (mode === 'simulation' && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mode, isTimerRunning]);

  // Format timer string MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start simulation with specific scenario
  const handleStartSimulation = (index) => {
    setCurrentScenarioIndex(index);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setSelectedObject(null);
    setMode('simulation');
  };

  // Scenario Navigation
  const handleNextScenario = () => {
    if (currentScenarioIndex < vrScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedObject(null);
    }
  };

  const handlePrevScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex((prev) => prev - 1);
      setSelectedObject(null);
    }
  };

  // Restart simulation timer & reset objects
  const handleRestart = () => {
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setSelectedObject(null);
  };

  // Toggle observation behaviors
  const toggleBehavior = (scenarioId, field) => {
    setObservations((prev) => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        [field]: !prev[scenarioId][field],
      },
    }));
  };

  // Update notes
  const handleNotesChange = (scenarioId, text) => {
    setObservations((prev) => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        notes: text,
      },
    }));
  };

  // Finish assessment
  const handleFinishAssessment = () => {
    setIsTimerRunning(false);
    setIsSummaryModalOpen(true);
  };

  // Save observations locally
  const handleSaveObservation = () => {
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      setIsSummaryModalOpen(false);
      setMode('selection');
    }, 1800);
  };

  // Calculate assessment statistics for summary
  const summaryStats = useMemo(() => {
    const scenarioKeys = Object.keys(observations);
    let totalObserved = 0;
    let totalItems = scenarioKeys.length * 4;

    scenarioKeys.forEach((key) => {
      const obs = observations[key];
      if (obs.eyeContact) totalObserved++;
      if (obs.jointAttention) totalObserved++;
      if (obs.instructions) totalObserved++;
      if (obs.socialInteraction) totalObserved++;
    });

    const completionPercentage = Math.round((totalObserved / totalItems) * 100);

    return {
      totalObserved,
      totalItems,
      completionPercentage,
    };
  }, [observations]);

  return (
    <div className="space-y-6 pb-12">
      {/* Main Page Header */}
      <Header
        title="VR Communication Assessment"
        subtitle="Observe and record communication behaviours in simulated real-world Virtual Reality environments."
      />

      {/* MODE 1: SCENARIO SELECTION DASHBOARD */}
      {mode === 'selection' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-blue-100 backdrop-blur-xs flex items-center gap-1.5 w-max">
                <Glasses className="w-4 h-4 text-white" /> Immersive Simulation Engine
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Virtual Environment Battery
              </h2>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                Select a simulated environment below to initiate live observation mode. Clinicians can interact with scene elements and evaluate eye contact, joint attention, and response time in real time.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 text-center">
              <Glasses className="w-16 h-16 text-white mx-auto animate-pulse" />
              <p className="text-xs font-semibold mt-2 text-blue-50">4 Environments Ready</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Select Assessment Scenario
            </h3>
            <span className="text-xs font-medium text-gray-500">4 Clinical Modules</span>
          </div>

          {/* 4 Scenario Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vrScenarios.map((scen, index) => (
              <Card
                key={scen.id}
                className="group hover:shadow-lg transition-all duration-200 overflow-hidden !p-0 border border-gray-200 flex flex-col justify-between"
              >
                {/* Visual Placeholder Header */}
                <div className={`h-40 bg-gradient-to-br ${scen.bgGradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex items-start justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 text-gray-900 backdrop-blur-xs shadow-xs">
                      Scenario 0{index + 1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${scen.difficultyBadge}`}>
                      {scen.difficulty}
                    </span>
                  </div>

                  {/* Simulated 3D Graphic Element */}
                  <div className="absolute right-4 bottom-2 opacity-25 group-hover:scale-110 transition-transform">
                    <Glasses className="w-28 h-28 text-white" />
                  </div>

                  <div className="z-10 text-white">
                    <h4 className="text-lg font-bold tracking-tight">{scen.name}</h4>
                    <p className="text-xs text-blue-100 font-medium mt-0.5">{scen.targetBehavior}</p>
                  </div>
                </div>

                {/* Scenario Details & Start Button */}
                <div className="p-5 space-y-4 bg-white flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {scen.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Environment Interactive Elements:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {scen.objects.map((obj, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-700 flex items-center gap-1">
                          <Box className="w-3 h-3 text-gray-400" /> {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Standardized VR Protocol</span>
                    <Button
                      variant="primary"
                      onClick={() => handleStartSimulation(index)}
                      className="text-xs flex items-center gap-1.5 py-2 px-4 shadow-xs"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Assessment</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: FULL-SCREEN VR SIMULATION & LIVE OBSERVATION */}
      {mode === 'simulation' && (
        <div className="space-y-6">
          
          {/* Top Simulation Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode('selection')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                title="Return to Scenario Selection"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Scenario {currentScenarioIndex + 1} of {vrScenarios.length}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">• {currentScenario.difficulty}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight mt-0.5">
                  {currentScenario.name}
                </h2>
              </div>
            </div>

            {/* Timer & Playback Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xs">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{formatTime(timerSeconds)}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="py-1.5 px-3 text-xs flex items-center gap-1"
                  title="Restart Timer & Scenario"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </Button>

                <Button
                  variant="primary"
                  onClick={handleFinishAssessment}
                  className="py-1.5 px-3.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finish Assessment</span>
                </Button>
              </div>
            </div>
          </div>

          {/* MAIN SIMULATION WORKSPACE: Left (Environment Canvas) | Right (Observation Panel) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLUMNS: VR Environment Graphic Illustration & Speech Bubble */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Large Environment Graphic Illustration Placeholder Canvas */}
              <div className={`w-full min-h-[360px] md:min-h-[420px] bg-gradient-to-br ${currentScenario.bgGradient} rounded-2xl p-6 text-white relative flex flex-col justify-between shadow-lg overflow-hidden border border-slate-800`}>
                
                {/* HUD Top Bar Overlay */}
                <div className="flex items-center justify-between z-10 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">Live VR Feed Active</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-200">
                    Target: {currentScenario.targetBehavior}
                  </span>
                </div>

                {/* Scenario Speech Bubble Overlay */}
                <div className="z-10 bg-white text-gray-900 p-4 rounded-2xl shadow-xl max-w-lg border border-blue-200 transform transition-all duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                    <MessageSquare className="w-4 h-4" /> Scenario Cue Dialogue
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed text-gray-800">
                    "{currentScenario.prompt}"
                  </p>
                </div>

                {/* Patient Avatar & Object Interaction Stage */}
                <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mt-4">
                  
                  {/* Patient Avatar Component */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-lg shadow-md border-2 border-white/40">
                      EV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{currentScenario.avatarName}</p>
                      <p className="text-[11px] text-blue-200 font-medium mt-0.5">{currentScenario.avatarStatus}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] rounded-full font-semibold">
                        Gaze Tracked
                      </span>
                    </div>
                  </div>

                  {/* Interactive Environment Objects Panel */}
                  <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-2">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                      <Box className="w-3.5 h-3.5 text-blue-400" /> Interactive Scene Objects:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {currentScenario.objects.map((obj, i) => {
                        const isSelected = selectedObject === obj;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedObject(isSelected ? null : obj)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left truncate ${
                              isSelected
                                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                                : 'bg-white/15 text-gray-200 hover:bg-white/25'
                            }`}
                          >
                            {obj}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Highlighted object interaction toast */}
                {selectedObject && (
                  <div className="z-20 absolute top-16 right-6 bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Focusing on: {selectedObject}</span>
                  </div>
                )}
              </div>

              {/* Bottom Controls Bar for Scenarios */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <Button
                  variant="outline"
                  onClick={handlePrevScenario}
                  disabled={currentScenarioIndex === 0}
                  className="text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Scenario</span>
                </Button>

                <div className="text-xs font-bold text-gray-700">
                  {currentScenario.name} ({currentScenarioIndex + 1}/{vrScenarios.length})
                </div>

                <Button
                  variant="outline"
                  onClick={handleNextScenario}
                  disabled={currentScenarioIndex === vrScenarios.length - 1}
                  className="text-xs flex items-center gap-1"
                >
                  <span>Next Scenario</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN: Real-Time Clinician Observation Panel */}
            <div className="space-y-4">
              <Card className="!p-5 space-y-4 border border-blue-200 shadow-sm">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Clinician Observation Panel
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                    Live Session
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Record observed behaviors for <span className="font-bold text-gray-800">{currentScenario.name}</span> in real time.
                </p>

                {/* Observation Checklists */}
                <div className="space-y-3">
                  
                  {/* Eye Contact */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Eye Contact</p>
                      <p className="text-[11px] text-gray-500">Direct gaze toward speaker</p>
                    </div>
                    <button
                      onClick={() => toggleBehavior(currentScenario.id, 'eyeContact')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        observations[currentScenario.id].eyeContact
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {observations[currentScenario.id].eyeContact ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </>
                      )}
                    </button>
                  </div>

                  {/* Joint Attention */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Joint Attention</p>
                      <p className="text-[11px] text-gray-500">Following shared gaze & points</p>
                    </div>
                    <button
                      onClick={() => toggleBehavior(currentScenario.id, 'jointAttention')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        observations[currentScenario.id].jointAttention
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {observations[currentScenario.id].jointAttention ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </>
                      )}
                    </button>
                  </div>

                  {/* Response to Instructions */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Response to Instructions</p>
                      <p className="text-[11px] text-gray-500">Comprehension & action latency</p>
                    </div>
                    <button
                      onClick={() => toggleBehavior(currentScenario.id, 'instructions')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        observations[currentScenario.id].instructions
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {observations[currentScenario.id].instructions ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </>
                      )}
                    </button>
                  </div>

                  {/* Social Interaction */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Social Interaction</p>
                      <p className="text-[11px] text-gray-500">Pragmatic turn-taking cues</p>
                    </div>
                    <button
                      onClick={() => toggleBehavior(currentScenario.id, 'socialInteraction')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        observations[currentScenario.id].socialInteraction
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {observations[currentScenario.id].socialInteraction ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div className="space-y-1.5 pt-2">
                  <label htmlFor="clinician-notes" className="block text-xs font-bold text-gray-700">
                    Clinician Behavioral Notes
                  </label>
                  <textarea
                    id="clinician-notes"
                    rows={3}
                    placeholder="Record specific observations, latency times, or prompt levels needed..."
                    value={observations[currentScenario.id].notes}
                    onChange={(e) => handleNotesChange(currentScenario.id, e.target.value)}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ASSESSMENT SUMMARY MODAL */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="VR Assessment Session Summary"
      >
        <div className="space-y-5 text-xs text-gray-700">
          
          {/* Summary Stats Header */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] font-bold uppercase text-blue-600">Total Observations</p>
              <p className="text-2xl font-extrabold text-blue-900 mt-0.5">{summaryStats.totalItems}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[10px] font-bold uppercase text-emerald-600">Behaviors Observed</p>
              <p className="text-2xl font-extrabold text-emerald-900 mt-0.5">{summaryStats.totalObserved}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-[10px] font-bold uppercase text-indigo-600">Overall Score</p>
              <p className="text-2xl font-extrabold text-indigo-900 mt-0.5">{summaryStats.completionPercentage}%</p>
            </div>
          </div>

          {/* Scenario Breakdown List */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Scenario Breakdown</h4>
            <div className="space-y-2">
              {vrScenarios.map((scen) => {
                const obs = observations[scen.id];
                const count = [obs.eyeContact, obs.jointAttention, obs.instructions, obs.socialInteraction].filter(Boolean).length;
                return (
                  <div key={scen.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{scen.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {count}/4 Behaviors Present • {obs.notes ? 'Notes Added' : 'No Notes'}
                      </p>
                    </div>
                    <span className="font-bold text-xs text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                      {Math.round((count / 4) * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toast Notification */}
          {isSavedToast && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Observation records saved successfully to local state.</span>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSummaryModalOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveObservation}
              className="text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Observation Record</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
