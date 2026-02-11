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
      <div className="min-h-screen w-full bg-[#111b21] flex flex-col items-center justify-center p-6 text-white">
        <div className="bg-[#202c33] p-10 rounded-2xl shadow-2xl border border-gray-800 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-[#00a884] mb-4">Vault Unlocked</h1>
          <p className="text-gray-400 mb-8 font-medium">Active Session: +{phone}</p>
          <div className="h-[200px] border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center mb-8">
            <p className="text-gray-500">Expense Dashboard Loading...</p>
          </div>
          <button
            onClick={() => {
              setIsUnlocked(false);
              setIsVerifying(false);
            }}
            className="text-red-500 text-sm font-semibold hover:underline"
          >
            Lock Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 2. OTP Verification Screen
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-[#111b21] flex items-center justify-center p-6 text-white">
        <div className="bg-[#202c33] p-10 rounded-2xl shadow-2xl border border-gray-800 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold mb-2">Verify Identity</h2>
          <p className="text-gray-400 mb-8 text-sm">Enter the code sent to +{phone}</p>
          <input type="text" maxLength="6" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-[#2a3942] text-center text-3xl tracking-widest font-mono py-4 rounded-xl mb-6 border border-transparent focus:border-[#00a884] outline-none transition-all" />
          <button onClick={handleVerifyOtp} className="w-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-4 rounded-full transition-all active:scale-95">
            Unlock Vault
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
        <p className="text-gray-400 mb-8 text-center text-sm">Enter your phone to access your private expenses.</p>

        <div className="mb-8 login-dark">
          <PhoneInput
            country={"ug"}
            value={phone}
            onChange={(p) => setPhone(p)}
            containerStyle={{ width: "100%" }}
            inputStyle={{
              backgroundColor: "#2a3942",
              color: "white",
              border: "none",
              width: "100%",
              height: "56px",
              borderRadius: "12px",
            }}
            buttonStyle={{
              backgroundColor: "#2a3942",
              border: "none",
              borderRadius: "12px 0 0 12px",
            }}
          />
        </div>

        <button onClick={handleRequestOtp} className="w-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-black/20">
          Request Access
        </button>
      </div>
    </div>
  );
}

export default App;
