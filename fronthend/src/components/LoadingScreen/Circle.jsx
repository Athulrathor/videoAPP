import React from "react";

const LoadingCircle = ({
  size = 60,
  color = "#ffffff",
  backgroundColor = "rgba(255, 255, 255, 0.3)",
  text = "Loading...",
  showText = true,
  speed = 1,
}) => {
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid ${backgroundColor}`,
    borderTop: `4px solid ${color}`,
    borderRadius: "50%",
    animation: `spin ${speed}s linear infinite`,
    margin: "0 auto 20px",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
  };

  const textStyle = {
    color: color,
    fontSize: "18px",
    fontWeight: "300",
    opacity: 0.8,
    animation: "pulse 1.5s ease-in-out infinite",
  };

  return (
    <div style={containerStyle}>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>

      <div className="loading-container">
        <div style={circleStyle}></div>
        {showText && <div style={textStyle}>{text}</div>}
      </div>
    </div>
  );
};

// Alternative inline component version
const InlineLoadingCircle = ({
  size = 40,
  color = "#3498db",
  backgroundColor = "#f3f3f3",
  className = "",
}) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className="rounded-full animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `3px solid ${backgroundColor}`,
          borderTop: `3px solid ${color}`,
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Demo component showing both versions
const Circle = () => {
  const [showFullscreen, setShowFullscreen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {showFullscreen ? (
        <div className="relative">
          <LoadingCircle
            size={80}
            text="Loading your content..."
            speed={0.8}
          />
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            Show Inline Version
          </button>
        </div>
      ) : (
        <div className="p-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Content Loading
            </h2>
            <p className="text-gray-600 mb-6">
              Here's an example of the inline loading circle:
            </p>

            <div className="flex items-center space-x-4 mb-6">
              <InlineLoadingCircle size={24} />
              <span className="text-gray-700">Loading data...</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <InlineLoadingCircle
                size={32}
                color="#10b981"
              />
              <span className="text-gray-700">Processing...</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <InlineLoadingCircle
                size={20}
                color="#f59e0b"
              />
              <span className="text-gray-700">Saving changes...</span>
            </div>

            <button
              onClick={() => setShowFullscreen(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Show Fullscreen Version
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circle;
