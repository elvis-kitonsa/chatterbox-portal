import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App() {
  // Your list of contacts
  // State to hold the list of contacts, each with an id, name, status, and color for the avatar.
  // This will be used to render the contact list in the sidebar.
  const [contacts, setContacts] = useState([
    { id: "tech-lead", name: "Tech Lead", status: "online", color: "bg-blue-500" },
    { id: "project-manager", name: "Project Manager", status: "last seen 2:00 PM", color: "bg-purple-500" },
    { id: "dev-team", name: "Dev Team Group", status: "Group Chat", color: "bg-orange-500" },
  ]);

  // Track which contact is currently selected
  const [activeContactId, setActiveContactId] = useState("tech-lead");

  // State to track if the user is currently typing a message. This can be used to show "typing..." indicators in the UI.
  const [isTyping, setIsTyping] = useState(false);

  // States to track if the user is unlocked, to store the phone number, and to manage OTP input
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // State to make the top search bar filter messages and contacts in real-time as the user types.
  // This will be used to implement the search functionality in the sidebar.
  const [searchTerm, setSearchTerm] = useState("");

  //Live Chat Functionality States:
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how is the ChatterBox progress?", sender: "them", time: "1:05 PM" },
    { id: 2, text: "The login portal is merged into main!", sender: "me", time: "1:08 PM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // State to manage the current wallpaper selection for the chat background. This allows users to switch between different wallpapers, enhancing personalization.
  const [wallpaper, setWallpaper] = useState("classic");

  // Add this with your other useState hooks
  const [theme, setTheme] = useState("dark"); // Default to dark

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

  // Add this near your other useState hooks
  // This will track if the user is currently recording a voice message and how long they've been
  // recording.
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  // Refs to handle media recording and audio playback
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [playingAudioId, setPlayingAudioId] = useState(null); // Track which audio is playing
  const audioPlayerRef = useRef(new Audio()); // Global audio player instance

  // This ref will be used to visualize the audio levels while recording a voice note.
  // In other words, it will allow us to create a dynamic visualizer that reacts to the user's voice input in real-time.
  const analyzerRef = useRef(null);
  const [visualizerData, setVisualizerData] = useState(new Array(10).fill(0));

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // A small sample of emojis. You can expand this list or group them by category!
  // State to manage the visibility of the emoji picker and a list of emojis to display in the picker.
  // This will allow users to insert emojis into their messages.
  const emojiList = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😻",
  ];

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

  // This sets a typing indicator and simulates a reply from the other person after you send a message.
  // It checks if the last message was sent by "me" and then sets a timer to show "typing..." and another
  // timer to add a reply message after a delay.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "me") {
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      const replyTimer = setTimeout(() => {
        const reply = {
          id: Date.now(),
          text: "Got it! I'm looking into the ChatterBox code now. 👍",
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
  }, [messages, activeContactId]);

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

  // This was the missing function causing the white screen!
  const handleRequestOtp = () => {
    if (phone.length > 10) {
      setIsVerifying(true);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handleVerifyOtp = () => {
    // For development, let's use '123456' as our secret code
    if (otp === "123456") {
      setIsUnlocked(true);
    } else {
      alert("Invalid OTP. Try '123456'");
    }
  };

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
        <aside className={`w-[340px] m-4 mr-0 rounded-[2.5rem] border border-white/5 flex flex-col backdrop-blur-3xl shadow-2xl z-20 overflow-hidden ${theme === "dark" ? "bg-[#111b21]/40" : "bg-white/60"}`}>
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
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">Workspace</p>
              </div>
            </div>
            <button onClick={() => setIsUnlocked(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-all">
              🔒
            </button>
          </div>

          {/* Search Capsule: For searching conversations and contacts within the sidebar */}
          <div className="px-6 pb-4">
            <div className="bg-[#2a3942] border border-white/10 rounded-2xl flex items-center px-4 py-3 shadow-inner">
              <span className="text-gray-400 mr-3">🔍</span>
              <input type="text" placeholder="Search conversations..." className="bg-transparent w-full outline-none text-sm text-white placeholder:text-gray-300 font-medium" />
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
                  className={`group flex items-center gap-4 p-4 mb-2 rounded-[1.8rem] transition-all duration-300 cursor-pointer border ${activeContactId === contact.id ? "bg-[#00a884]/10 border-[#00a884]/30 shadow-lg translate-x-1" : "border-transparent hover:bg-white/5 hover:translate-x-1"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${contact.color} flex-shrink-0 shadow-lg relative`}>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      {/* This makes the active name bright white and the others readable gray */}
                      <h3 className={`font-bold text-sm truncate ${activeContactId === contact.id ? "text-white" : "text-gray-300"}`}>{contact.name}</h3> <span className="text-[9px] font-bold opacity-30 italic">12:45</span>
                    </div>
                    <p className="text-[11px] opacity-40 font-medium truncate">Online • Secure</p>
                  </div>
                </div>
              ))}
          </div>
        </aside>

        {/* 💬 2. FLOATING MESSAGING HUB */}
        <main className="flex-1 m-4 flex flex-col relative z-10">
          {/* Floating Header */}
          <header className={`p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl mb-4 flex items-center justify-between shadow-xl ${theme === "dark" ? "bg-[#111b21]/40" : "bg-white/60"}`}>
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
          <div className={`flex-1 rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl ${theme === "dark" ? "bg-[#0b141a]/60" : "bg-white/40"}`}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

            <div className="h-full overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar relative z-10">
              {messages
                .filter((m) => m.contactId === activeContactId || !m.contactId)
                .map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "me" ? (
                      /* --- YOUR OUTGOING BUBBLE (STAYS THE SAME OR ADJUSTED) --- */
                      <div className="p-4 rounded-[1.8rem] max-w-[70%] bg-gradient-to-br from-[#00a884] to-[#05cd99] text-[#111b21] rounded-tr-none shadow-xl shadow-[#00a884]/20">
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1.5 mt-2 opacity-70 text-[9px] font-bold">
                          <span>{msg.time}</span>
                          <span>✓✓</span>
                        </div>
                      </div>
                    ) : (
                      /* --- PASTE THE UPDATED INCOMING BUBBLE HERE --- */
                      <div className="bg-[#2a3942] text-white border-t border-white/10 rounded-[1.8rem] rounded-tl-none p-4 shadow-xl max-w-[70%]">
                        <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                        <div className="text-[10px] text-gray-400 mt-2 text-right font-bold italic">{msg.time}</div>
                      </div>
                    )}
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Floating Input Pod */}
          <footer className="mt-4 flex justify-center p-2">
            <div className="w-full max-w-4xl bg-[#2a3942] backdrop-blur-3xl border border-white/15 rounded-[2.5rem] p-3 flex items-center gap-4 shadow-2xl">
              <button className="w-12 h-12 rounded-2xl hover:bg-white/10 flex items-center justify-center text-xl">😊</button>
              <input type="text" placeholder="Message secure workspace..." className="flex-1 bg-transparent py-2 outline-none text-[15px] text-white placeholder:text-gray-400 font-medium" />
              {/* ... Send Button ... */}
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // 2. OTP Verification Screen
  if (isVerifying) {
    return (
<<<<<<< Updated upstream
      <div className="min-h-screen w-full bg-[#111b21] flex items-center justify-center p-6 text-white">
        <div className="bg-[#202c33] p-10 rounded-2xl border border-gray-800 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
          <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-[#2a3942] text-center text-3xl py-4 rounded-xl mb-6 border border-transparent focus:border-[#00a884] outline-none" placeholder="000000" />
          <button onClick={handleVerifyOtp} className="w-full bg-[#00a884] py-4 rounded-full font-bold text-[#111b21]">
            Verify
=======
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
>>>>>>> Stashed changes
          </button>
        </div>
      </div>
    );
  }

  // 3. Login Screen (Dark Mode)
  // Replace your "3. Login Screen" return block with this:
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

        <button className="w-full bg-transparent border-2 border-[#2a3942] hover:border-[#00a884] hover:text-[#00a884] text-gray-400 font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
          <span className="text-xl group-hover/btn:scale-110 transition-transform duration-300">🔒</span> Login with Fingerprint
        </button>
      </div>
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
