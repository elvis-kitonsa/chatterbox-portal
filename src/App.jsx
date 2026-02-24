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
  // 1. Logic to send the OTP
  // 1. Logic to send the OTP
  const handleRequestOtp = () => {
    if (phone.length >= 10) {
      // Generate the code
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = Date.now() + 3 * 60 * 1000;

      // Update states
      setGeneratedOtp(newOtp); // Used for the actual logic check
      setGeneratedOTP(newOtp); // Used for the display in the simulation modal
      setOtpExpiry(expiryTime);
      setIsExpired(false);

      // OPEN THE PRETTY MODAL
      setShowSimulation(true);

      // Keep this for debugging in the inspect tool
      console.log(`%c [SECURITY] OTP for ${phone}: ${newOtp}`, "color: #00a884; font-weight: bold; font-size: 16px;");

      // REMOVE the old alert() line that was here!
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  // 2. Logic to verify the OTP
  const handleVerifyOtp = () => {
    const currentTime = Date.now();

    // 1. Check if the time has run out
    if (currentTime > otpExpiry) {
      setIsExpired(true);
      alert("This code has expired. Please request a new one.");
      return; // Stop the function here
    }

    // 2. Proceed with normal verification (Check if the OTP is correct)
    if (otp === generatedOTP) {
      setIsUnlocked(true);

      // Optional: Reset verification states
      setIsVerifying(false);
      console.log("Access Granted: Redirecting to Dashboard...");
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  // This function allows users to add emojis to their message input.
  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    // Optional: Auto-close after picking? Usually, WhatsApp stays open.
  };
  // 1. Dashboard Screen (Dark Mode)
  if (isUnlocked) {
    return (
      <div className={`flex h-screen ${themeClasses.bg} ${themeClasses.text} overflow-hidden transition-colors duration-300`}>
        {/* 1. Left Sidebar: Contacts & Chats */}
        <div className={`w-[30%] border-r ${theme === "dark" ? "border-gray-700" : "border-gray-300"} flex flex-col ${themeClasses.sidebarBg}`}>
          {/* Profile Header */}
          <div className={`p-4 ${themeClasses.headerBg} flex justify-between items-center`}>
            <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center font-bold text-[#111b21]">ME</div>
            <div className="flex gap-5 text-gray-400">
              <button className="hover:text-white">👥</button>
              <button className="hover:text-white">💬</button>
              <button onClick={() => setIsUnlocked(false)} className="hover:text-red-400">
                🔒
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3">
            <div className={`${themeClasses.inputBg} flex items-center px-4 py-1.5 rounded-lg`}>
              <span className="text-gray-500 mr-3">🔍</span>
              <input type="text" placeholder="Search or start new chat" className="bg-transparent text-sm w-full outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {(() => {
              // 1. Create the filtered list first
              const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()));

              // 2. If no contacts match, show the "No results" UI
              if (filteredContacts.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                    <span className="text-4xl mb-3">🕵️‍♂️</span>
                    <p className="text-gray-400 text-sm">
                      No contacts found matching <br />
                      <span className="text-white font-medium">"{searchTerm}"</span>
                    </p>
                  </div>
                );
              }

              // 3. Otherwise, map through the filtered results as usual
              return filteredContacts.map((contact) => (
                <div key={contact.id} onClick={() => setActiveContactId(contact.id)} className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-gray-800/50 ${activeContactId === contact.id ? "bg-[#2a3942]" : "hover:bg-[#2a3942]/50"}`}>
                  <div className={`w-12 h-12 ${contact.color} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm">{contact.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-1">Click to chat</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* 2. Main Window: Active Messaging Area */}
        <div className={`flex-1 flex flex-col ${themeClasses.chatBg} relative`}>
          {/* Chat Header */}
          {(() => {
            const activeContact = contacts.find((c) => c.id === activeContactId);
            return (
              <div className="p-3 bg-[#202c33] flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${activeContact?.color} rounded-full`}></div>
                  <div>
                    <h2 className="font-medium text-sm">{activeContact?.name}</h2>
                    <p className="text-[10px] text-[#00a884]">{isTyping ? "typing..." : activeContact?.status}</p>
                  </div>
                </div>

                {/* NEW: Wallpaper Switcher UI */}
                {/* Updated Theme/Wallpaper Switcher */}
                <div className="flex items-center gap-3 bg-[#111b21]/20 p-2 rounded-full border border-gray-700/30">
                  {/* Theme Toggle (Sun/Moon) */}
                  <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-lg mr-2 hover:scale-110 transition-transform" title="Switch Theme">
                    {theme === "dark" ? "☀️" : "🌙"}
                  </button>
                  <div className="w-[1px] h-4 bg-gray-600 mr-1" /> {/* Divider */}
                  {/* Existing Wallpaper Buttons */}
                  <button onClick={() => setWallpaper("classic")} className={`w-4 h-4 rounded-full bg-gray-500 border ${wallpaper === "classic" ? "border-white scale-125" : "border-transparent"}`} title="Classic" />
                  <button onClick={() => setWallpaper("midnight")} className={`w-4 h-4 rounded-full bg-[#0b141a] border ${wallpaper === "midnight" ? "border-white scale-125" : "border-transparent"}`} title="Midnight" />
                  <button onClick={() => setWallpaper("nebula")} className={`w-4 h-4 rounded-full bg-indigo-900 border ${wallpaper === "nebula" ? "border-white scale-125" : "border-transparent"}`} title="Nebula" />
                </div>
              </div>
            );
          })()}

          {/* Messages Container */}
          <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-3" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundOpacity: 0.05 }}>
            {messages
              .filter((msg) => {
                // Filter messages to show only those that belong to the active chat and match the search term
                const isCurrentChat = msg.contactId === activeContactId || !msg.contactId;
                const matchesSearch = (msg.text || "").toLowerCase().includes(searchTerm.toLowerCase());
                return isCurrentChat && matchesSearch;
              })
              .map((msg) => (
                <div key={msg.id} className={`p-2.5 rounded-lg max-w-md text-sm shadow-sm ${msg.sender === "me" ? "bg-[#005c4b] self-end rounded-tr-none" : "bg-[#202c33] self-start rounded-tl-none"}`}>
                  {/* --- INSERTED MEDIA LOGIC START --- */}
                  {msg.fileUrl && msg.type === "image" && <img src={msg.fileUrl} alt="attachment" className="rounded-lg mb-2 max-h-60 w-full object-cover" />}

                  {/* voice and audio message UI */}
                  {msg.type === "voice" && (
                    <div className="flex items-center gap-3 bg-[#111b21] p-3 rounded-lg mb-2 min-w-[200px]">
                      <button onClick={() => togglePlayVoiceNote(msg.id, msg.fileUrl)} className="text-xl text-[#00a884] hover:scale-110 transition-transform">
                        {playingAudioId === msg.id ? "⏸️" : "▶️"}
                      </button>
                      <div className="flex-1 h-1 bg-gray-600 rounded-full relative">
                        <div className={`absolute left-0 top-0 h-full bg-[#00a884] rounded-full transition-all duration-300 ${playingAudioId === msg.id ? "w-full" : "w-0"}`}></div>
                      </div>
                      <span className="text-[10px] text-gray-400">{formatTime(msg.duration)}</span>
                    </div>
                  )}

                  {!msg.fileUrl && msg.type !== "voice" && <div>{msg.text}</div>}
                  {/* --- INSERTED MEDIA LOGIC END --- */}

                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={`text-[9px] block text-right ${msg.sender === "me" ? "text-[#ffffff80]" : "text-gray-500"}`}>{msg.time}</span>
                    {msg.sender === "me" && (
                      <span className="text-[12px] leading-none flex">
                        {msg.status === "sent" && <span className="text-gray-400">✓</span>}
                        {msg.status === "delivered" && <span className="text-gray-400">✓✓</span>}
                        {msg.status === "read" && <span className="text-[#53bdeb]">✓✓</span>}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Field */}

          {/* EMOJI PICKER POPUP */}
          {showEmojiPicker && (
            <div className="absolute bottom-[70px] left-4 w-72 h-64 bg-[#2a3942] rounded-xl shadow-2xl border border-gray-700 overflow-y-auto p-3 custom-scrollbar z-50">
              <div className="grid grid-cols-6 gap-2">
                {emojiList.map((emoji, index) => (
                  <button key={index} onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-[#374151] rounded p-1 transition-colors">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-[#202c33] flex items-center gap-4">
            {isRecording ? (
              <div className="flex flex-1 items-center justify-between bg-[#2a3942] px-4 py-2 rounded-xl">
                <div className="flex items-center gap-3">
                  {/* TRASH ICON: The Cancellation feature */}
                  <button onClick={cancelRecording} className="text-gray-400 hover:text-red-500 transition-colors">
                    🗑️
                  </button>

                  {/* THE DANCING WAVEFORM */}
                  <div className="flex items-end gap-[3px] h-5">
                    {visualizerData.map((val, i) => (
                      <div key={i} className="w-[3px] bg-[#00a884] rounded-full transition-all duration-75" style={{ height: `${Math.max(20, val * 100)}%` }}></div>
                    ))}
                  </div>

                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
                </div>
                <button onClick={stopAndSendVoiceNote} className="text-[#00a884] font-bold text-sm hover:underline">
                  DONE
                </button>
              </div>
            ) : (
              // NORMAL INPUT UI
              <>
                {/* 1. Added toggle logic and dynamic coloring to the emoji button */}
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`text-xl transition-colors ${showEmojiPicker ? "text-[#00a884]" : "text-gray-400 hover:text-white"}`}>
                  😊
                </button>

                <button onClick={() => fileInputRef.current.click()} className="text-xl text-gray-400 hover:text-white">
                  📎
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />

                {/* 2. Added onFocus to auto-close the picker when the user starts typing */}
                <input type="text" placeholder="Type a message" className="flex-1 bg-[#2a3942] py-2.5 px-4 rounded-xl outline-none text-sm text-white" value={newMessage} onFocus={() => setShowEmojiPicker(false)} onChange={(e) => setNewMessage(e.target.value)} />
              </>
            )}

            {/* TOGGLE MICROPHONE / SEND */}
            {newMessage.trim() === "" && !isRecording ? (
              <button onClick={startRecording} className="text-xl text-gray-400 hover:text-[#00a884]">
                🎤
              </button>
            ) : (
              !isRecording && (
                <button onClick={handleSendMessage} className="bg-[#00a884] p-2 rounded-full text-[#111b21]">
                  ➤
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Page background + card (switches between login and verify) ── */}
      <div className="min-h-screen w-full flex items-center justify-center p-6 font-sans" style={{ background: "linear-gradient(135deg, #0f1729 0%, #1a2340 50%, #0f2027 100%)" }}>

        {isVerifying ? (
          /* ── OTP VERIFICATION CARD ── */
          <div className="w-full max-w-sm rounded-3xl p-10 text-center" style={{ backgroundColor: "#1e2a3a", border: "1px solid rgba(99,179,237,0.15)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 8px 24px rgba(59,130,246,0.4)" }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>

            <h2 className="text-2xl font-black mb-1 tracking-tight" style={{ color: "#e2e8f0" }}>Check your phone</h2>
            <p className="text-sm mb-7" style={{ color: "#64748b" }}>
              Enter the code sent to <span className="font-bold" style={{ color: "#38bdf8" }}>+{phone}</span>
            </p>

            <label className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2 block text-left" style={{ color: "#38bdf8" }}>Verification Code</label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-4xl tracking-[0.4em] font-mono py-5 rounded-2xl outline-none transition-all duration-200 mb-5"
              style={{ backgroundColor: "#111d2b", color: "#e2e8f0", border: "2px solid #2d4a6b" }}
              onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
              onBlur={(e) => (e.target.style.borderColor = "#2d4a6b")}
              placeholder="000000"
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full py-4 rounded-2xl font-bold text-white tracking-wide transition-all duration-200 active:scale-95 mb-4 text-[15px]"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Verify &amp; Sign In →
            </button>

            <div className="mb-4">
              {isExpired
                ? <p className="text-red-400 text-xs font-bold animate-pulse">CODE EXPIRED</p>
                : <p className="text-xs" style={{ color: "#475569" }}>Valid for 3 minutes only</p>
              }
            </div>

            <button
              onClick={() => setIsVerifying(false)}
              className="text-xs font-semibold transition-colors duration-200"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              ← Use a different number
            </button>
          </div>
        ) : (
          /* ── LOGIN CARD ── */
          <div className="w-full max-w-sm rounded-3xl p-10" style={{ backgroundColor: "#1e2a3a", border: showSimulation ? "1px solid rgba(56,189,248,0.6)" : "1px solid rgba(99,179,237,0.15)", boxShadow: showSimulation ? "0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(56,189,248,0.55), 0 0 0 3px rgba(56,189,248,0.3)" : "0 25px 60px rgba(0,0,0,0.5)", transform: showSimulation ? "scale(0.95)" : "scale(1)", transition: "all 0.35s ease" }}>
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto hover:scale-105 transition-transform duration-200 cursor-default"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 10px 30px rgba(59,130,246,0.4)" }}
            >
              <svg viewBox="0 0 24 24" width="38" height="38" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>

            <h1 className="text-3xl font-black mb-1 text-center tracking-tight" style={{ color: "#e2e8f0" }}>
              Chatter<span style={{ color: "#38bdf8" }}>Box</span>
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: "#475569" }}>Your space to connect &amp; communicate</p>

            <label className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2 block" style={{ color: "#38bdf8" }}>Phone Number</label>
            <PhoneInput
              country={"ug"}
              value={phone}
              onChange={(p) => setPhone(p)}
              containerStyle={{ width: "100%", marginBottom: "20px" }}
              inputStyle={{
                backgroundColor: "#111d2b",
                color: "#e2e8f0",
                width: "100%",
                height: "58px",
                borderRadius: "14px",
                border: "2px solid #2d4a6b",
                fontSize: "16px",
              }}
              buttonStyle={{
                backgroundColor: "#111d2b",
                border: "none",
                borderRadius: "14px 0 0 14px",
                paddingLeft: "10px",
              }}
              dropdownStyle={{
                backgroundColor: "#1e2a3a",
                color: "#e2e8f0",
              }}
            />

            <button
              onClick={handleRequestOtp}
              className="w-full active:scale-95 text-white font-bold py-4 rounded-2xl transition-all duration-200 text-[15px] tracking-wide mb-5"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Continue →
            </button>

            <p className="text-center text-xs" style={{ color: "#475569" }}>
              By continuing you agree to our{" "}
              <span className="font-semibold cursor-pointer hover:underline" style={{ color: "#38bdf8" }}>Terms</span>
              {" "}&amp;{" "}
              <span className="font-semibold cursor-pointer hover:underline" style={{ color: "#38bdf8" }}>Privacy Policy</span>
            </p>
          </div>
        )}
      </div>

      {/* ── OTP SIMULATION POPUP — always at root level, overlays everything ── */}
      {showSimulation && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] backdrop-blur-md" style={{ backgroundColor: "rgba(5,10,20,0.5)" }}>
          <div className="max-w-sm w-full text-center mx-4 rounded-3xl p-10" style={{ backgroundColor: "#1e2a3a", border: "1px solid rgba(56,189,248,0.3)", boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.08)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 8px 24px rgba(59,130,246,0.4)" }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>

            <h3 className="text-2xl font-black tracking-tight mb-1" style={{ color: "#e2e8f0" }}>Your Access Code</h3>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>Use this code to verify your identity</p>

            <div className="py-7 rounded-2xl mb-6" style={{ backgroundColor: "#111d2b", border: "2px solid #2d4a6b" }}>
              <span className="text-5xl font-mono font-black tracking-[0.15em] block" style={{ color: "#38bdf8" }}>{generatedOTP}</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedOTP);
                setShowSimulation(false);
                setIsVerifying(true);
              }}
              className="w-full py-4 text-white font-bold rounded-2xl transition-all active:scale-95 tracking-wide"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Copy Code &amp; Continue →
            </button>

            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#38bdf8" }}></div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#475569" }}>Simulation Mode</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
