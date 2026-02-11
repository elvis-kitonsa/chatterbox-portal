import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App() {
  // States to track if the user is unlocked and to store the phone number
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    if (phone.length > 10) {
      // In a real app, this is where you'd send an OTP
      setIsUnlocked(true);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  if (isUnlocked) {
    return (
      <div className="min-h-screen w-full bg-[#111b21] text-white p-6">
        <h1 className="text-2xl font-bold text-[#00a884]">ChatterBox Dashboard</h1>
        <p className="mt-4 text-gray-400">Welcome! Your secure session is active for: +{phone}</p>
        <button onClick={() => setIsUnlocked(false)} className="mt-4 text-red-500 underline">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#111b21]">
      <div className="bg-[#202c33] p-10 rounded-2xl shadow-2xl text-center border border-gray-800 max-w-sm w-full">
        <h1 className="text-4xl font-bold text-[#00a884] mb-2">ChatterBox</h1>
        <p className="text-gray-400 mb-8">Login with Phone Number</p>

        <div className="mb-6 text-left">
          <PhoneInput
            country={"ug"} // Defaulting to Uganda
            value={phone}
            onChange={(phone) => setPhone(phone)}
            containerStyle={{ borderRadius: "8px" }}
            inputStyle={{
              backgroundColor: "#2a3942",
              color: "white",
              border: "none",
              width: "100%",
              height: "45px",
            }}
            buttonStyle={{ backgroundColor: "#2a3942", border: "none" }}
          />
        </div>

        <button onClick={handleLogin} className="w-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-3 px-10 rounded-full transition-all">
          Verify & Enter
        </button>
      </div>
    </div>
  );
}

export default App;
