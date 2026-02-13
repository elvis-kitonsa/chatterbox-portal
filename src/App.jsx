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
  // 1. Dashboard Screen (Dark Mode)
  if (isUnlocked) {
    return (
      <div className="flex h-screen bg-[#111b21] text-[#e9edef] overflow-hidden">
        {/* 1. Left Sidebar: Contacts & Chats */}
        <div className="w-[30%] border-r border-gray-700 flex flex-col bg-[#111b21]">
          {/* Profile Header */}
          <div className="p-4 bg-[#202c33] flex justify-between items-center">
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
            <div className="bg-[#202c33] flex items-center px-4 py-1.5 rounded-lg">
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
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">
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
                <div className="flex items-center gap-3 bg-[#111b21]/50 p-2 rounded-full border border-gray-700">
                  <button onClick={() => setWallpaper("classic")} className={`w-4 h-4 rounded-full bg-gray-500 border ${wallpaper === "classic" ? "border-white scale-125" : "border-transparent"}`} title="Classic Doodle" />
                  <button onClick={() => setWallpaper("midnight")} className={`w-4 h-4 rounded-full bg-[#0b141a] border ${wallpaper === "midnight" ? "border-white scale-125" : "border-transparent"}`} title="Midnight Solid" />
                  <button onClick={() => setWallpaper("nebula")} className={`w-4 h-4 rounded-full bg-indigo-900 border ${wallpaper === "nebula" ? "border-white scale-125" : "border-transparent"}`} title="Nebula Gradient" />
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

  // 2. OTP Verification Screen
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-[#111b21] flex items-center justify-center p-6 text-white">
        <div className="bg-[#202c33] p-10 rounded-2xl border border-gray-800 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
          <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-[#2a3942] text-center text-3xl py-4 rounded-xl mb-6 border border-transparent focus:border-[#00a884] outline-none" placeholder="000000" />
          <button onClick={handleVerifyOtp} className="w-full bg-[#00a884] py-4 rounded-full font-bold text-[#111b21]">
            Verify
          </button>
        </div>
      </div>
    );
  }

  // 3. Login Screen (Dark Mode)
  return (
    <div className="min-h-screen w-full bg-[#111b21] flex items-center justify-center p-6 text-white">
      <div className="bg-[#202c33] p-10 rounded-2xl shadow-2xl border border-gray-800 max-w-sm w-full">
        <div className="w-16 h-16 bg-[#00a884]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
          <span className="text-2xl">🛡️</span>
        </div>
        <h1 className="text-3xl font-bold text-[#00a884] mb-2 text-center">ChatterBox</h1>
        <p className="text-gray-400 mb-8 text-center text-sm">Secure Phone Login</p>

        <div className="mb-8">
          <PhoneInput
            country={"ug"}
            value={phone}
            onChange={(p) => setPhone(p)}
            enableSearch={true} // Adds a search bar for easier navigation
            containerStyle={{ width: "100%" }}
            inputStyle={{
              backgroundColor: "#2a3942",
              color: "white",
              width: "100%",
              height: "56px",
              borderRadius: "12px",
              border: "1px solid #374151",
            }}
            buttonStyle={{
              backgroundColor: "#2a3942",
              border: "1px solid #374151",
              borderRadius: "12px 0 0 12px",
            }}
            // FIXES THE DROPDOWN VISIBILITY:
            dropdownStyle={{
              backgroundColor: "#2a3942",
              color: "#ffffff",
              textAlign: "left",
              width: "300px",
            }}
            searchStyle={{
              backgroundColor: "#111b21",
              color: "white",
              width: "90%",
              margin: "10px auto",
            }}
          />
        </div>

        <button onClick={handleRequestOtp} className="w-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-4 rounded-full transition-all shadow-lg">
          Get OTP Code
        </button>
      </div>
    </div>
  );
}

export default App;
