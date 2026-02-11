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

  // 1. Dashboard Screen (After login)
  if (isUnlocked) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-[#00a884]">Dashboard Access</h1>
          <p className="text-gray-500 mb-8">Logged in as: +{phone}</p>
          <button
            onClick={() => {
              setIsUnlocked(false);
              setIsVerifying(false);
            }}
            className="w-full bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
          >
            Lock Session
          </button>
        </div>
      </div>
    );
  }

  // 2. OTP Verification Screen
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Phone</h2>
          <p className="text-gray-400 mb-8 text-sm">Enter code sent to +{phone}</p>
          <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-center text-3xl font-mono py-4 border-2 border-gray-100 rounded-2xl mb-6 focus:border-[#00a884] focus:outline-none" placeholder="000000" />
          <button onClick={handleVerifyOtp} className="w-full bg-[#00a884] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#06cf9c] transition-all">
            Confirm OTP
          </button>
        </div>
      </div>
    );
  }

  // 3. Initial Phone Input Screen (Whitish Theme)
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">ChatterBox</h1>
        <p className="text-gray-400 mb-8 text-center text-sm font-medium">Secure Login</p>
        <div className="mb-8">
          <PhoneInput country={"ug"} value={phone} onChange={(p) => setPhone(p)} inputClass="!w-full !h-14 !text-lg !rounded-xl !border-gray-100 !bg-gray-50" buttonClass="!bg-gray-50 !border-gray-100 !rounded-l-xl" />
        </div>
        <button onClick={handleRequestOtp} className="w-full bg-[#00a884] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#06cf9c] transition-all active:scale-95">
          Request Code
        </button>
      </div>
    </div>
  );
}

export default App;
