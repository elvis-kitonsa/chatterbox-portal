import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App() {
  // States to track if the user is unlocked, to store the phone number, and to manage OTP input
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

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
      <div className="min-h-screen w-full bg-[#111b21] flex items-center justify-center p-6 text-white text-center">
        <div className="bg-[#202c33] p-10 rounded-2xl border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-bold text-[#00a884] mb-4">Dashboard Active</h1>
          <p className="text-gray-400">Welcome back, +{phone}</p>
          <button onClick={() => setIsUnlocked(false)} className="mt-8 text-red-500 underline">
            Logout
          </button>
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
