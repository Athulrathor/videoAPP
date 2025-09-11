import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdMic } from 'react-icons/md';
import { Mic, MicOff, X, AlertCircle } from 'lucide-react';
import { useAppearance } from '../hooks/appearances';

const MicAnimated = (props) => {
  const { appearanceSettings } = useAppearance();
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Handle browser support error
  if (!browserSupportsSpeechRecognition) {
    return (
      <div
        className={`${props.micOpen ? "" : "hidden"} absolute z-15 p-3 flex items-center justify-center transition-all`}
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          padding: 'var(--component-padding)',
          transitionDuration: 'var(--animation-duration)',
          zIndex: 15
        }}
        role="alert"
        aria-live="assertive"
      >
        <div
          className="flex flex-col items-center p-6 rounded-2xl border shadow-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-error)',
            padding: 'var(--section-gap)'
          }}
        >
          <AlertCircle
            className="w-12 h-12 mb-4"
            style={{ color: 'var(--color-error)' }}
          />
          <h2
            className="text-xl font-semibold mb-2 text-center"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-xl)',
              fontFamily: 'var(--font-family)',
              marginBottom: 'var(--spacing-unit)'
            }}
          >
            Speech Recognition Not Supported
          </h2>
          <p
            className="text-center mb-4"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              marginBottom: 'var(--spacing-unit)'
            }}
          >
            Your browser does not support speech recognition. Please try using Chrome or Edge for the best experience.
          </p>
          <button
            onClick={() => props.setMicOpen(false)}
            className="p-2 rounded-full transition-all"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-bg-tertiary)';
            }}
            aria-label="Close speech recognition dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${props.micOpen ? "" : "hidden"} absolute z-15 p-3 translate-y-4/5 flex flex-col min-w-80 items-center justify-center transition-all rounded-lg max-md:rounded-full max-md:w-screen max-md:h-screen`}
      style={{
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-accent-bg) 100%)',
        padding: 'var(--component-padding)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        zIndex: 15,
        transitionDuration: 'var(--animation-duration)'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="speech-title"
      aria-describedby="speech-description"
    >
      {/* Header */}
      <div
        className="w-full flex justify-between mb-2 items-center"
        style={{
          marginBottom: 'var(--spacing-unit)',
          gap: 'var(--spacing-unit)'
        }}
      >
        <h1
          id="speech-title"
          className="text-2xl font-medium"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-2xl)',
            fontFamily: 'var(--font-family)'
          }}
        >
          {listening ? "Listening..." : "Ready to Listen"}
        </h1>
        <button
          onClick={() => props.setMicOpen(false)}
          className="p-2 rounded-full transition-all"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            transitionDuration: 'var(--animation-duration)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-hover)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)';
            e.target.style.transform = 'scale(1)';
          }}
          aria-label="Close speech recognition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Status Description */}
      <p
        id="speech-description"
        className="text-center mb-4"
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-base)',
          marginBottom: 'var(--spacing-unit)'
        }}
      >
        {listening
          ? "Speak now - your voice is being processed..."
          : "Click the microphone to start voice recognition"
        }
      </p>

      {/* Animated Mic Button */}
      <div
        className="flex justify-center items-center mt-4"
        style={{ marginTop: 'var(--spacing-unit)' }}
      >
        <button
          className="relative flex items-center justify-center w-32 h-32 rounded-full text-white text-6xl outline-none border-0 transition-all duration-150 shadow-xl"
          style={{
            background: listening
              ? 'linear-gradient(135deg, var(--color-error), var(--color-error-hover))'
              : 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
            boxShadow: listening
              ? `0 0 40px 10px rgba(239, 68, 68, 0.4), 0 0 0 0 #fff`
              : `0 4px 20px 3px var(--color-accent-shadow)`,
            transform: listening ? 'scale(1.05)' : 'scale(1)',
            transitionDuration: appearanceSettings.reducedMotion ? '0s' : '0.15s'
          }}
          onClick={() =>
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening({ continuous: true })
          }
          onMouseEnter={(e) => {
            if (!listening && !appearanceSettings.reducedMotion) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 8px 30px 5px rgba(0, 0, 0, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!listening && !appearanceSettings.reducedMotion) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = `0 4px 20px 3px var(--color-accent-shadow)`;
            }
          }}
          aria-label={listening ? "Stop listening to speech" : "Start listening to speech"}
          aria-pressed={listening}
          role="button"
          tabIndex={0}
        >
          <span className="sr-only">
            {listening ? "Stop listening" : "Start listening"}
          </span>
          <MdMic
            className={`transition-all duration-200`}
            style={{
              transform: listening ? 'scale(1.1)' : 'scale(1)',
              filter: listening ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' : 'none',
              transitionDuration: 'var(--animation-duration)'
            }}
          />
          {listening && !appearanceSettings.reducedMotion && (
            <>
              <span
                className="absolute -z-10 w-[170%] h-[170%] rounded-full animate-ping"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  filter: 'blur(4px)',
                  animationDuration: '2s'
                }}
              />
              <span
                className="absolute -z-10 w-[140%] h-[140%] rounded-full animate-pulse"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                  animationDuration: '1.5s'
                }}
              />
            </>
          )}
        </button>
      </div>

      {/* Controls Section */}
      <div
        className="flex mt-4 flex-col items-center"
        style={{
          marginTop: 'var(--spacing-unit)',
          gap: 'var(--spacing-unit)'
        }}
      >
        <p
          className="text-center"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          Start/Stop the mic by clicking the button below
        </p>
        <button
          onClick={() =>
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening({ continuous: true })
          }
          className="flex mt-4 px-6 py-3 rounded-full shadow-lg transition-all"
          style={{
            backgroundColor: listening ? 'var(--color-error)' : 'var(--accent-color)',
            color: 'white',
            marginTop: 'var(--spacing-unit)',
            padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
            gap: 'var(--spacing-unit)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-family)',
            transitionDuration: 'var(--animation-duration)'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.9';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          aria-label={listening ? "Stop voice recognition" : "Start voice recognition"}
          aria-pressed={listening}
        >
          {listening ? (
            <span className="flex items-center gap-2">
              <MicOff className="w-5 h-5" />
              <span>Stop</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              <span>Start</span>
            </span>
          )}
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div
          className="mt-6 p-4 rounded-xl w-full max-w-md"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            border: '1px solid',
            marginTop: 'var(--section-gap)',
            padding: 'var(--spacing-unit)'
          }}
          role="log"
          aria-label="Speech transcript"
          aria-live="polite"
        >
          <h3
            className="text-sm font-medium mb-2"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family)',
              marginBottom: 'var(--spacing-unit)'
            }}
          >
            Transcript:
          </h3>
          <p
            className="text-sm italic"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
              fontStyle: 'italic'
            }}
          >
            {transcript}
          </p>
        </div>
      )}

      {/* Live Region for Screen Readers */}
      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      >
        {listening ? "Voice recognition is active" : "Voice recognition is inactive"}
      </div>

      <style>{`
        @keyframes fade-in {
          0% { 
            opacity: 0; 
            transform: translateY(10px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in ${appearanceSettings.reducedMotion ? '0s' : '0.35s'} ease;
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring ${appearanceSettings.reducedMotion ? '0s' : '2s'} infinite ease-out;
        }
      `}</style>
    </div>
  );
};

export default MicAnimated;
