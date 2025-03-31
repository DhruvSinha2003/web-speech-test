import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [result, setResult] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3020");

    setSocket(newSocket);

    newSocket.on("transcription", (data) => {
      setMessages((prev) => [...prev, { text: data.text, sender: "other" }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Your browser doesn't support speech recognition. Try Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.addEventListener("result", (e) => {
      const last = e.results.length - 1;
      const text = e.results[last][0].transcript;
      setResult(text);

      if (socket) {
        socket.emit("sendTranscription", { text });
        setMessages((prev) => [...prev, { text, sender: "me" }]);
      }

      console.log("Confidence: " + e.results[last][0].confidence);
    });

    recognition.addEventListener("end", () => {
      if (isRecording) {
        recognition.start();
      }
    });

    recognition.start();
    setIsRecording(true);

    window.recognitionInstance = recognition;
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (window.recognitionInstance) {
      window.recognitionInstance.stop();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-3xl font-bold mb-8">Live Transcription App</h1>

      <div className="w-full max-w-lg mb-6 bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">
            Transcriptions will appear here
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === "me"
                  ? "bg-blue-600 ml-auto"
                  : "bg-gray-700 mr-auto"
              } max-w-xs`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      <div className="flex space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-green-500 font-semibold rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-500 font-semibold rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            Stop Recording
          </button>
        )}
      </div>

      {result && (
        <div className="mt-4 text-center">
          <p className="text-lg">Current: {result}</p>
        </div>
      )}

      <p className="mt-8 text-sm text-gray-400">
        Note: Make sure your browser has microphone access permissions.
      </p>
    </div>
  );
}

export default App;
