import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App() {
  // 1. AUTHENTICATION & PORTAL STATES
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(""); // Needed for simulation
  const [showSimulation, setShowSimulation] = useState(false); // Needed for modal
  const [isExpired, setIsExpired] = useState(false); // For OTP countdown

  // 2. CHAT & CONTACT STATES
  const [contacts, setContacts] = useState([
    { id: "tech-lead", name: "Tech Lead", status: "online", color: "bg-blue-500" },
    { id: "project-manager", name: "Project Manager", status: "last seen 2:00 PM", color: "bg-purple-500" },
    { id: "dev-team", name: "Dev Team Group", status: "Group Chat", color: "bg-orange-500" },
  ]);
  const [activeContactId, setActiveContactId] = useState("tech-lead"); // Track which contact is currently selected
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how is the ChatterBox progress?", sender: "them", time: "1:05 PM" },
    { id: 2, text: "The login portal is merged into main!", sender: "me", time: "1:08 PM" },
  ]);
  const [newMessage, setNewMessage] = useState(""); // This will be used to store the text of the new message being typed in the input field.
  const [searchTerm, setSearchTerm] = useState(""); // This will be used to implement the search functionality in the sidebar.

  // 3. UI & THEME STATES
  const [theme, setTheme] = useState("dark"); // Default to dark
  const [isTyping, setIsTyping] = useState(false); // State to track if the user is currently typing a message. This can be used to show "typing..." indicators in the UI.
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [wallpaper, setWallpaper] = useState("classic"); // State to manage the current wallpaper selection for the chat background. This allows users to switch between different wallpapers, enhancing personalization.

  // 4. VOICE & MEDIA STATES (Keep these for later)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null); // Track which audio is playing
  const [visualizerData, setVisualizerData] = useState(new Array(10).fill(0));

  // 5. REFS
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayerRef = useRef(new Audio()); // Global audio player instance
  const analyzerRef = useRef(null);

  // 6. HELPER DATA (Emojis)
  const EMOJI_CATEGORIES = [
    { name: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"] },
    { name: "Gestures", emojis: ["👍", "👎", "👊", "✌️", "🤟", "🤘", "👌", "🤌", "🤏", "🖐️", "✋", "🖖", "👋", "🤙", "💪", "🖕"] },
    { name: "Hearts", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖"] },
    { name: "Activities", emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑"] },
  ];

  // --- AUTHENTICATION LOGIC ---

  // Updated to trigger the Simulation Modal
  const handleRequestOtp = () => {
    if (phone && phone.length > 5) {
      // Create a random 6-digit code for the simulation
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOtp);
      setShowSimulation(true); // This opens the "Secure Access" modal we built
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  // Updated to check against the generated code
  const handleVerifyOtp = () => {
    // For development, let's use '123456' as our secret code
    if (otp === generatedOTP || otp === "123456") {
      setIsUnlocked(true);
      setIsVerifying(false);
    } else {
      alert("Invalid code. Check the simulation box!");
    }
  };

  // --- CHAT EFFECTS ---
  // This sets a typing indicator and simulates a reply from the other person after you send a message.
  // It checks if the last message was sent by "me" and then sets a timer to show "typing..." and another
  // timer to add a reply message after a delay.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "me" && !lastMessage.isReplyGenerated) {
      // Mark as processed so we don't trigger infinite loops
      lastMessage.isReplyGenerated = true;

      const typingTimer = setTimeout(() => setIsTyping(true), 1500);

      const replyTimer = setTimeout(() => {
        const activeContact = contacts.find((c) => c.id === activeContactId);
        const reply = {
          id: Date.now(),
          text: `Hey! This is ${activeContact?.name}. Received your message: "${lastMessage.text}"`,
          sender: "them",
          contactId: activeContactId,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      }, 4000);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(replyTimer);
      };
    }
  }, [messages, activeContactId, contacts]);

  // Helper to get theme-based classes
  const themeClasses = {
    bg: theme === "dark" ? "bg-[#111b21]" : "bg-[#f0f2f5]",
    sidebarBg: theme === "dark" ? "bg-[#111b21]" : "bg-white",
    headerBg: theme === "dark" ? "bg-[#202c33]" : "bg-[#f0f2f5]",
    chatBg: theme === "dark" ? "bg-[#0b141a]" : "bg-[#efeae2]",
    text: theme === "dark" ? "text-[#e9edef]" : "text-[#111b21]",
    secondaryText: theme === "dark" ? "text-gray-400" : "text-gray-600",
    inputBg: theme === "dark" ? "bg-[#2a3942]" : "bg-white",
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Watch for changes in the 'messages' array
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This function handles sending a new message in the chat.
  // It checks if the input is not empty, creates a new message object, updates the messages state, and clears the input field.
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      contactId: activeContactId, // TAG THE MESSAGE TO THE ACTIVE CHAT
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent", // New property: 'sent', 'delivered', or 'read'
    };

    // Update the messages state by adding the new message to the existing array of messages.
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  // This simulates the other person reading your message after 3 seconds
  // and updates messages status to "Read" after a delay with blue ticks.
  // It checks the last message sent by "me" and if it's still "sent", it updates it to "read" after 3 seconds.
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "me" && lastMessage.status === "sent") {
      const timer = setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === lastMessage.id ? { ...m, status: "read" } : m)));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  // This function handles file uploads in the chat.
  // It creates a new message with the file information and updates the messages state.
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For now, we create a local URL to preview the image
    const fileUrl = URL.createObjectURL(file);

    const msg = {
      id: Date.now(),
      text: file.name,
      fileUrl: fileUrl,
      type: file.type.startsWith("image/") ? "image" : "file",
      sender: "me",
      contactId: activeContactId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages([...messages, msg]);
  };

  // --- NEW VOICE NOTE FUNCTIONS START ---
  // Actual Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // --- WAVEFORM LOGIC START ---
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 32; // Small size for a simple waveform
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualizer = () => {
        if (!analyzerRef.current) return;
        analyzerRef.current.getByteFrequencyData(dataArray);

        // We take a slice of the data and convert it to a small array for our bars
        const normalizedData = Array.from(dataArray.slice(0, 10)).map((v) => v / 255);
        setVisualizerData(normalizedData);
        requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();
      // --- WAVEFORM LOGIC END ---

      mediaRecorder.current = new MediaRecorder(stream);

      // ADD THIS: This actually collects the audio data as it's recorded
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      // ... (rest of your existing mediaRecorder logic)
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch (err) {
      alert("Microphone access denied!");
    }
  };

  const stopAndSendVoiceNote = () => {
    if (!mediaRecorder.current) return;

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const voiceMsg = {
        id: Date.now(),
        type: "voice",
        fileUrl: audioUrl, // THE ACTUAL SOUND DATA
        duration: recordingTime,
        sender: "me",
        contactId: activeContactId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };

      setMessages((prev) => [...prev, voiceMsg]);
      audioChunks.current = [];
    };

    mediaRecorder.current.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // NEW: Cancellation Feature
  const cancelRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop(); // Stop recording
      audioChunks.current = []; // Wipe the data
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Playback Logic
  const togglePlayVoiceNote = (id, url) => {
    if (playingAudioId === id) {
      audioPlayerRef.current.pause();
      setPlayingAudioId(null);
    } else {
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.play();
      setPlayingAudioId(id);
      audioPlayerRef.current.onended = () => setPlayingAudioId(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  // --- NEW VOICE NOTE FUNCTIONS END ---

  // This function allows users to add emojis to their message input.
  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    // Optional: Auto-close after picking? Usually, WhatsApp stays open.
  };

  // 1. Dashboard Screen (Dark Mode - To match the color aesthetic of Whatsapp)
  if (isUnlocked) {
    return (
      <div className={`flex h-screen overflow-hidden transition-all duration-700 font-sans relative ${theme === "dark" ? "bg-[#080c0e] text-white" : "bg-gray-50 text-gray-900"}`}>
        {/* 🌌 DYNAMIC BACKGROUND BLUR NODES */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#00a884]/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* 📱 1. ULTRA-MODERN SIDEBAR (Glass Panel) */}
        <aside className={`w-[340px] m-4 mr-0 rounded-[2.5rem] flex flex-col shadow-2xl z-20 overflow-hidden border ${theme === "dark" ? "bg-[#1a2630] border-white/[0.1]" : "bg-white/60 border-white/5 backdrop-blur-3xl"}`}>
          {/* Top Branding/Profile Area */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00a884]/20 transform hover:rotate-6 transition-transform cursor-pointer">
                <span className="text-xl text-[#111b21]">💬</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter">
                  Chatter<span className="text-[#00a884]">Box</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Workspace</p>
              </div>
            </div>
            <button onClick={() => setIsUnlocked(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-all">
              🔒
            </button>
          </div>

          {/* Search Capsule: For searching conversations and contacts within the sidebar */}
          <div className="px-6 pb-4">
            <div className="bg-[#0d1c24] border border-white/[0.12] rounded-2xl flex items-center px-4 py-3 shadow-inner">
              <span className="text-gray-400 mr-3">🔍</span>
              <input type="text" placeholder="Search conversations..." className="bg-transparent w-full outline-none text-sm text-white placeholder:text-gray-400 font-medium" />
            </div>
          </div>

          {/* Modern List */}
          <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
            {contacts
              .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={`group flex items-center gap-4 p-4 mb-2 rounded-[1.8rem] transition-all duration-300 cursor-pointer border ${activeContactId === contact.id ? "bg-[#00a884]/15 border-[#00a884]/40 shadow-lg translate-x-1" : "border-transparent hover:bg-white/[0.07] hover:translate-x-1"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${contact.color} flex-shrink-0 shadow-lg relative`}>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      {/* This makes the active name bright white and the others readable gray */}
                      <h3 className={`font-bold text-sm truncate ${activeContactId === contact.id ? "text-white" : "text-gray-200"}`}>{contact.name}</h3> <span className="text-[9px] font-bold text-gray-500 italic">12:45</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium truncate">Online • Secure</p>
                  </div>
                </div>
              ))}
          </div>
        </aside>

        {/* 💬 2. FLOATING MESSAGING HUB */}
        <main className="flex-1 m-4 flex flex-col relative z-10">
          {/* Floating Header */}
          <header className={`p-4 rounded-[2rem] mb-4 flex items-center justify-between shadow-xl border ${theme === "dark" ? "bg-[#1a2630] border-white/[0.1]" : "bg-white/60 border-white/5 backdrop-blur-xl"}`}>
            {(() => {
              const activeContact = contacts.find((c) => c.id === activeContactId);
              return (
                <div className="flex items-center gap-4 ml-2">
                  <div className={`w-10 h-10 ${activeContact?.color} rounded-xl shadow-inner`}></div>
                  <div>
                    <h2 className="text-sm font-black tracking-tight">{activeContact?.name}</h2>
                    <p className="text-[10px] text-[#00a884] font-bold uppercase tracking-widest animate-pulse">● Active Now</p>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center gap-3 bg-black/30 p-2 rounded-2xl border border-white/5 mr-2">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <div className="w-[1px] h-4 bg-white/10"></div>
              <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
            </div>
          </header>

          {/* Message Viewport - Floating Cards Style */}
          <div className={`flex-1 rounded-[2.5rem] overflow-hidden relative shadow-2xl border ${theme === "dark" ? "bg-[#0d1c24] border-white/[0.08]" : "bg-white/40 border-white/5"}`}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

            <div className="h-full overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar relative z-10">
              {messages
                .filter((m) => m.contactId === activeContactId || !m.contactId)
                .map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`p-4 shadow-xl transition-all duration-300 w-fit max-w-[80%] rounded-[2rem] ${
                        msg.sender === "me"
                          ? "bg-[#054740] text-white shadow-[#054740]/20"
                          : "bg-[#273b48] text-white border border-white/[0.1]"
                      }`}
                    >
                      {msg.type === "voice" ? (
                        <div className="flex items-center gap-3 min-w-[280px] sm:min-w-[320px] py-1 px-1">
                          {/* 1. REFINED SPEED BADGE */}
                          <div className="flex-shrink-0 bg-white/10 rounded-full w-9 h-9 flex items-center justify-center text-[11px] font-bold text-white border border-white/5">1x</div>

                          {/* 2. WHITE PLAY/PAUSE BUTTON */}
                          <button onClick={() => togglePlayVoiceNote(msg.id, msg.fileUrl)} className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-transform active:scale-95 group">
                            {playingAudioId === msg.id ? (
                              <div className="flex gap-1.5">
                                <div className="w-[3px] h-5 bg-white rounded-full animate-pulse"></div>
                                <div className="w-[3px] h-5 bg-white rounded-full animate-pulse"></div>
                              </div>
                            ) : (
                              <div className="ml-1 w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white group-hover:border-l-[#05cd99] transition-colors"></div>
                            )}
                          </button>

                          <div className="flex-1 flex flex-col pt-1">
                            {/* 3. ADAPTIVE WAVEFORM */}
                            <div className="flex items-center gap-[1.5px] h-8 mb-1">
                              {[...Array(35)].map((_, i) => {
                                const heights = [20, 45, 30, 70, 25, 80, 50, 35, 90, 40, 60, 25, 75, 50, 30, 80, 45, 60, 95, 30, 55, 70, 35, 65, 45, 90, 55, 25, 80, 35, 65, 45, 75, 25, 90];
                                const time = currentAudioTime || 0;
                                const duration = msg.duration || 5;
                                const progress = (time / duration) * 35;
                                const isPlayed = playingAudioId === msg.id && i < progress;

                                return <div key={i} className={`w-[2px] rounded-full transition-all duration-150 ${isPlayed ? "bg-white" : "bg-white/30"}`} style={{ height: `${heights[i % heights.length]}%` }} />;
                              })}
                            </div>

                            {/* 4. TIMER AND SVG TICKS */}
                            <div className="flex justify-between items-center pr-1">
                              <span className="text-[10px] font-medium text-white/70 tabular-nums">{playingAudioId === msg.id ? formatTime(currentAudioTime) : formatTime(msg.duration)}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-white/50">{msg.time}</span>
                                {msg.sender === "me" && (
                                  <span className="flex items-center">
                                    {msg.status === "read" ? (
                                      /* Enhanced Blue Ticks for Dark Mode */
                                      <svg viewBox="0 0 16 11" width="14" height="10" fill="none">
                                        <path d="M1 5L5 9L15 1" stroke="#34B7F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 5L9 9L19 1" stroke="#34B7F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4, 0)" />
                                      </svg>
                                    ) : (
                                      /* Clean White Ticks */
                                      <svg viewBox="0 0 16 11" width="14" height="10" fill="none">
                                        <path d="M1 5L5 9L15 1" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        {msg.status === "delivered" && <path d="M5 5L9 9L19 1" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4, 0)" />}
                                      </svg>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {/* Image/File/Text Logic */}
                          {msg.type === "image" ? (
                            <img src={msg.fileUrl} alt="attachment" className="max-w-[240px] rounded-2xl cursor-pointer" />
                          ) : msg.type === "file" ? (
                            /* File Link UI */
                            <div className="flex items-center gap-3 bg-black/10 p-3 rounded-2xl">
                              <span className="text-white">📄</span>
                              <p className="text-[13px] font-bold truncate">{msg.text}</p>
                            </div>
                          ) : (
                            <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                          )}

                          {/* --- THE FIX: UNIFORM TICK CATALOGUE --- */}
                          <div className="flex items-center justify-end gap-1.5 mt-1 text-[9px] font-bold">
                            <span className={msg.sender === "me" ? "opacity-70" : "text-gray-400"}>{msg.time}</span>

                            {msg.sender === "me" && (
                              <span className="flex items-center ml-1">
                                {msg.status === "read" ? (
                                  /* Blue Ticks */
                                  <svg viewBox="0 0 16 11" width="14" height="10" fill="none">
                                    <path d="M1 5L5 9L15 1" stroke="#34B7F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 5L9 9L19 1" stroke="#34B7F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4, 0)" />
                                  </svg>
                                ) : (
                                  /* Uniform White Ticks */
                                  <svg viewBox="0 0 16 11" width="14" height="10" fill="none">
                                    <path d="M1 5L5 9L15 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                                    {msg.status === "delivered" && <path d="M5 5L9 9L19 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" transform="translate(-4, 0)" />}
                                  </svg>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Floating Input Pod */}
          <footer className="mt-4 flex items-end gap-2 p-2 max-w-5xl mx-auto w-full">
            {/* 1. THE MAIN CAPSULE (White/Gray background) */}
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-[1.5rem] shadow-sm border ${theme === "dark" ? "bg-[#1a2630] border-white/[0.1]" : "bg-white border-gray-200"}`}>
              {/* Emoji Picker Pop-up */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-0 w-72 h-80 bg-[#2a3942] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 border-b border-white/5 bg-[#202c33] text-xs font-bold text-gray-400 uppercase tracking-widest">Emoji Picker</div>

                  <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    {EMOJI_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="mb-4">
                        <h4 className="text-[10px] text-gray-500 font-bold mb-2 uppercase">{cat.name}</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {cat.emojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setNewMessage((prev) => prev + emoji);
                                // WhatsApp usually keeps it open until you click away
                              }}
                              className="text-xl hover:bg-white/10 p-1 rounded-lg transition-colors active:scale-125"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Emoji Button */}
              <button
                type="button" // Important to prevent form submission
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1 transition-colors ${showEmojiPicker ? "text-[#00a884]" : "text-gray-400 hover:text-gray-200"}`}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
                </svg>
              </button>

              {isRecording ? (
                /* RECORDING STATE: Show Timer & Visualizer inside capsule */
                <div className="flex-1 flex items-center justify-between px-2">
                  <span className="text-red-500 animate-pulse font-medium">{formatTime(recordingTime)}</span>
                  <div className="flex gap-0.5 items-center h-4">
                    {visualizerData.map((v, i) => (
                      <div key={i} className="w-0.5 bg-gray-400 rounded-full" style={{ height: `${Math.max(20, v * 100)}%` }} />
                    ))}
                  </div>
                  <button onClick={cancelRecording} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-500">
                    Slide to cancel
                  </button>
                </div>
              ) : (
                /* NORMAL STATE: Input + Attachment */
                <>
                  <input
                    type="text"
                    placeholder="Message"
                    className="flex-1 bg-transparent border-none focus:ring-0 py-1 text-[16px] text-white placeholder:text-gray-400 outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    onFocus={() => setShowEmojiPicker(false)}
                  />

                  {/* Attachment (Clip) */}
                  <button onClick={() => fileInputRef.current?.click()} className="p-1 text-gray-400 hover:text-gray-200 -rotate-45">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4s-4 1.79-4 4v12.5c0 3.31 2.69 6 6 6s6-2.69 6-6V6h-1.5z"></path>
                    </svg>
                  </button>

                  {/* Contacts (Profile) */}
                  {!newMessage && (
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-200"
                      onClick={() => {
                        /* This should open profile or contact info, NOT recording */
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* 2. THE ACTION CIRCLE (Floating on the right) */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents the click from bubbling up to other elements
                if (newMessage.trim()) {
                  handleSendMessage();
                } else {
                  isRecording ? stopAndSendVoiceNote() : startRecording();
                }
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all flex-shrink-0 z-50 ${isRecording ? "bg-red-500 animate-pulse" : "bg-[#00a884]"}`}
            >
              {newMessage.trim() ? (
                /* Send Arrow SVG */
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="ml-1">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              ) : (
                /* WhatsApp Microphone SVG */
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path>
                </svg>
              )}
            </button>
          </footer>
        </main>
      </div>
    );
  }

  // OPTION 2: THE OTP VERIFICATION (Show this if they just clicked 'Send Code')
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-[#0b141a] flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-[#202c33] p-12 rounded-[2.5rem] border border-[#00a884]/30 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00a884]/5 rounded-full blur-3xl"></div>

          {/* Updated Chat Logo (Matches Login) */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-[#00a884]/20">
            <span className="text-3xl text-[#111b21]">💬</span>
          </div>

          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Verify it's you</h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            We sent a code to <br />
            <span className="text-[#00a884] font-bold">+{phone}</span>
          </p>

          <div className="group mb-8">
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[#2a3942] text-center text-4xl tracking-[0.4em] font-mono py-5 rounded-2xl border-2 border-transparent group-hover:border-gray-600 focus:border-[#00a884] outline-none transition-all duration-300 shadow-inner"
              placeholder="000000"
            />
          </div>

          <button onClick={handleVerifyOtp} className="w-full bg-[#00a884] hover:bg-[#05cd99] hover:scale-[1.02] hover:shadow-[0_10px_20px_rgba(0,168,132,0.3)] py-4 rounded-2xl font-black text-[#111b21] uppercase tracking-widest transition-all duration-300 active:scale-95 mb-4">
            Confirm Code
          </button>

          {/* Expiry Warning UI */}
          {/* Add a visual cue to indicate the code is about to expire */}
          <div className="mt-4">{isExpired ? <p className="text-red-500 text-xs font-bold animate-pulse">CODE EXPIRED</p> : <p className="text-gray-300 text-[10px] uppercase tracking-tighter">Valid for 3 minutes only</p>}</div>

          <button onClick={() => setIsVerifying(false)} className="text-gray-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200">
            ← Use different number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0b141a] flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-[#202c33] p-10 rounded-[2.5rem] shadow-2xl border border-[#00a884]/20 max-w-sm w-full relative overflow-hidden group">
        {/* Dynamic Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00a884]/10 rounded-full blur-3xl group-hover:bg-[#00a884]/20 transition-all duration-700"></div>

        {/* New Chat Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-[#00a884]/20 transform transition-transform hover:rotate-6">
          <span className="text-4xl text-[#111b21]">💬</span>
        </div>

        <h1 className="text-4xl font-black text-white mb-2 text-center tracking-tight">
          Chatter<span className="text-[#00a884]">Box</span>
        </h1>
        <p className="text-gray-400 mb-10 text-center text-sm font-medium tracking-wide">Engage. Talk. Interact.</p>

        <div className="mb-8">
          <label className="text-[10px] font-bold text-[#00a884] uppercase tracking-[0.2em] ml-1 mb-2 block">Phone Number</label>
          <PhoneInput
            country={"ug"}
            value={phone}
            onChange={(p) => setPhone(p)}
            containerStyle={{ width: "100%" }}
            inputStyle={{
              backgroundColor: "#2a3942",
              color: "white",
              width: "100%",
              height: "60px",
              borderRadius: "18px",
              border: "2px solid transparent",
              fontSize: "16px",
            }}
            buttonStyle={{
              backgroundColor: "#2a3942",
              border: "none",
              borderRadius: "18px 0 0 18px",
              paddingLeft: "10px",
            }}
          />
        </div>

        <button onClick={handleRequestOtp} className="w-full bg-[#00a884] hover:bg-[#05cd99] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,168,132,0.4)] active:scale-95 text-[#111b21] font-bold py-4 rounded-2xl transition-all duration-300 mb-4">
          Send Verification Code
        </button>
      </div>

      {showSimulation && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-[#0b141a]/95 backdrop-blur-md animate-in fade-in duration-300">
          {/* Main Card */}
          <div className="bg-[#111b21] border border-white/5 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative overflow-hidden ring-1 ring-white/10">
            {/* Subtle brand glow in the background */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00a884]/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
              {/* REPLACED: Shield is gone. Using your branded chat logo with a glow */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_0_20px_rgba(0,168,132,0.4)]">
                <span className="text-3xl filter drop-shadow-sm">💬</span>
              </div>

              <h3 className="text-white text-2xl font-black tracking-tight mb-2">Secure Access</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
                Confirm the code below to enter your <br />
                <span className="text-[#00a884] opacity-80 uppercase text-[10px] font-bold tracking-[0.2em]">verified workspace</span>
              </p>

              {/* Improved Code Box: Deeper contrast and neon text */}
              <div className="bg-[#202c33] py-8 rounded-[2rem] border border-white/5 mb-10 shadow-inner group">
                <span className="text-5xl font-mono font-black text-[#00a884] tracking-[0.15em] drop-shadow-[0_0_12px_rgba(0,168,132,0.3)] group-hover:scale-110 transition-transform duration-500 block">{generatedOTP}</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedOTP);
                  setShowSimulation(false);
                  setIsVerifying(true);
                }}
                className="w-full py-5 bg-[#00a884] hover:bg-[#05cd99] text-[#111b21] font-bold rounded-2xl transition-all shadow-lg shadow-[#00a884]/20 uppercase text-xs tracking-[0.2em] active:scale-95"
              >
                Copy & Continue
              </button>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#00a884] rounded-full animate-pulse"></div>
                <span className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-bold">Secure Simulation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
