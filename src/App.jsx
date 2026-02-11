import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App() {
  // States to track if the user is unlocked, to store the phone number, and to manage OTP input
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  //Live Chat Functionality States:
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how is the ChatterBox progress?", sender: "them", time: "1:05 PM" },
    { id: 2, text: "The login portal is merged into main!", sender: "me", time: "1:08 PM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // This function handles sending a new message in the chat.
  // It checks if the input is not empty, creates a new message object, updates the messages state, and clears the input field.
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update the messages state by adding the new message to the existing array of messages.
    setMessages([...messages, msg]);
    setNewMessage("");
  };

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
              <input type="text" placeholder="Search or start new chat" className="bg-transparent text-sm w-full outline-none" />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 flex gap-3 hover:bg-[#2a3942] cursor-pointer transition-colors border-b border-gray-800/50">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Tech Lead</h3>
                  <span className="text-[10px] text-gray-500">1:05 PM</span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-1">Is the login portal finished?</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Window: Active Messaging Area */}
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">
          {/* Chat Header */}
          <div className="p-3 bg-[#202c33] flex items-center gap-4 shadow-md">
            <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
            <div>
              <h2 className="font-medium text-sm">Tech Lead</h2>
              <p className="text-[10px] text-[#00a884]">online</p>
            </div>
          </div>

          {/* Messages Container (Simulated) */}
          {/* Messages Container */}
          <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-3" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundOpacity: 0.05 }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`p-2.5 rounded-lg max-w-md text-sm shadow-sm ${msg.sender === "me" ? "bg-[#005c4b] self-end rounded-tr-none" : "bg-[#202c33] self-start rounded-tl-none"}`}>
                {msg.text}
                <span className={`text-[9px] block text-right mt-1 ${msg.sender === "me" ? "text-[#ffffff80]" : "text-gray-500"}`}>{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Bottom Input Field */}
          {/* Bottom Input Field */}
          <div className="p-3 bg-[#202c33] flex items-center gap-4">
            <button className="text-xl text-gray-400 hover:text-white">😊</button>
            <button className="text-xl text-gray-400 hover:text-white">📎</button>
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 bg-[#2a3942] py-2.5 px-4 rounded-xl outline-none text-sm text-white"
              value={newMessage} // LINK TO STATE
              onChange={(e) => setNewMessage(e.target.value)} // UPDATE STATE
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} // SEND ON ENTER
            />
            <button
              onClick={handleSendMessage} // SEND ON CLICK
              className="bg-[#00a884] p-2 rounded-full hover:scale-105 transition-transform text-[#111b21]"
            >
              ➤
            </button>
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
