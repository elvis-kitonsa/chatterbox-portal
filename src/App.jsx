import React from "react";

function App() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#111b21]">
      <div className="bg-[#202c33] p-10 rounded-2xl shadow-2xl text-center border border-gray-800">
        <h1 className="text-4xl font-bold text-[#00a884] mb-2">ChatterBox</h1>
        <p className="text-gray-400 mb-8">Secure Biometric Access</p>
        <button onClick={() => alert("Biometric scan initiated...")} className="bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-3 px-10 rounded-full transition-all active:scale-95">
          Unlock with Biometrics
        </button>
      </div>
    </div>
  );
}

export default App;
