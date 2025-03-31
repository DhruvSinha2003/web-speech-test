import React from "react";

const App = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const recordButton = () => {
    recognition.start();
  };
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center text-white">
      <button
        onClick={recordButton}
        className="px-6 py-3 bg-gray-200 text-black font-semibold rounded-full hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
      >
        Record
      </button>
    </div>
  );
};

export default App;
