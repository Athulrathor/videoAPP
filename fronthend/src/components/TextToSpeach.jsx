import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdMic } from 'react-icons/md';
import { Mic, MicOff, X } from 'lucide-react';

const MicAnimated = (props) => {
  const {
    transcript,
    listening,
    // resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className={`${props.micOpen ? "" : "hidden"} absolute z-15 p-3  flex items-center justify-center`}>
            <button onClick={() => props.setMicOpen(true)} className={` p-2 rounded-full hover:bg-gray-100 active:bg-gray-200`}>
                  <X />
              </button>
        <span className="text-red-400 text-lg">Your browser does not support speech recognition.</span>
      </div>
    );
  }

  return (
      <div className={`${props.micOpen ? "" : "hidden"} absolute z-15 p-3 translate-y-4/5 flex flex-col min-w-80 items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 transition-all rounded-lg max-md:rounded-full max-md:w-screen max-md:h-screen`}>
          
          <div className='w-full flex justify-between mb-2 items-center'>
              <h1 className='text-2xl font-medium'>{listening ? "Listening... " : "Waiting for permission"}</h1>
              <button onClick={() => props.setMicOpen(false)} className={` p-2 rounded-full hover:bg-gray-100 active:bg-gray-200`}>
                  <X />
              </button>
          </div>
      {/* Animated Mic Button */}
          <div className='flex justify-center items-center mt-4'>
              <button
        className={`
          relative flex items-center justify-center w-32 h-32
          rounded-full text-white text-6xl
          outline-none border-0 transition-shadow duration-150
          shadow-xl
          ${listening
            ? 'bg-gradient-to-tr from-red-400 via-red-500 to-red-600 animate-pulse'
            : 'bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-800 hover:shadow-2xl'}
        `}
        style={{
          boxShadow: listening
            ? '0 0 40px 10px rgba(239,68,68,0.4), 0 0 0 0 #fff'
            : '0 4px 20px 3px rgba(59,130,246,0.07)',
        }}
        onClick={() =>
          listening
            ? SpeechRecognition.stopListening()
            : SpeechRecognition.startListening()
        }
        aria-label={listening ? "Stop listening" : "Start listening"}
      >
        <span className="sr-only">{listening ? "Stop listening" : "Start listening"}</span>
        <MdMic className={`transition-all duration-200 ${listening ? 'scale-110 drop-shadow-lg' : ''}`} />
        {listening && (
          <span
            className="
              absolute -z-10 w-[170%] h-[170%] rounded-full
              bg-red-400/20 blur-lg animate-ping
            "
          />
        )}
      </button>
          </div>
          <div className='flex mt-4 flex-col items-center'>
              <h1>{"Start/Stop the mic by click below button"}</h1>
              <button onClick={() =>
          listening
            ? SpeechRecognition.stopListening()
            : SpeechRecognition.startListening()
        }  className='flex mt-4 px-6 shadow-2xs py-2 rounded-4xl bg-gray-100'>
                  {listening ? (<span className='flex space-x-2'><MicOff /><h4>Stop</h4></span>) : (<span className='flex space-x-2'><Mic /><h4>Start</h4></span>)}

              </button>
          </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease;
        }
      `}</style>
    </div>
  );
};

export default MicAnimated;