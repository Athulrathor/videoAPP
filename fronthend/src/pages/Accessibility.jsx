
import React, { useState } from 'react';
import {
    AccessibilityIcon,
    Video,
    Volume2,
    VolumeX,
    Type,
    Eye,
    EyeOff,
    MousePointer,
    Keyboard,
    Move,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Settings,
    Monitor,
    Headphones,
    Mic,
    Gamepad2,
    Navigation,
    Timer,
    Zap,
    Focus,
    ArrowUp,
    ArrowDown,
    RotateCcw,
    Save
} from 'lucide-react';


const Accessibility = () => {
    const [videoQuality, setVideoQuality] = useState('auto');
    const [autoplay, setAutoplay] = useState(true);
    const [closedCaptions, setClosedCaptions] = useState(false);
    const [audioDescriptions, setAudioDescriptions] = useState(false);
    const [keyboardNavigation, setKeyboardNavigation] = useState(true);
    const [screenReader, setScreenReader] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [focusIndicators, setFocusIndicators] = useState(true);
    const [fontSize, setFontSize] = useState('medium');
    const [cursorSize, setCursorSize] = useState('normal');
    const [clickDelay, setClickDelay] = useState('normal');
    const [voiceControl, setVoiceControl] = useState(false);
    const [gestureControl, setGestureControl] = useState(false);
    const [autoScrollSpeed, setAutoScrollSpeed] = useState('medium');
    const [skipDuration, setSkipDuration] = useState(10);
    const [volumeBoost, setVolumeBoost] = useState(false);
    const [colorAdjustment, setColorAdjustment] = useState('none');
    const [readingSpeed, setReadingSpeed] = useState('normal');

    const videoQualityOptions = [
        { id: 'auto', name: 'Auto', description: 'Automatically adjust based on connection' },
        { id: '2160p', name: '2160p (4K)', description: 'Ultra High Definition - Best quality' },
        { id: '1440p', name: '1440p (2K)', description: 'Quad HD - High quality' },
        { id: '1080p', name: '1080p (HD)', description: 'Full HD - Good quality' },
        { id: '720p', name: '720p', description: 'HD - Standard quality' },
        { id: '480p', name: '480p', description: 'SD - Lower bandwidth' },
        { id: '360p', name: '360p', description: 'Low - Minimal bandwidth' },
        { id: '240p', name: '240p', description: 'Very Low - For slow connections' }
    ];

    const fontSizeOptions = [
        { id: 'small', name: 'Small', scale: '0.875x', description: 'Compact text' },
        { id: 'medium', name: 'Medium', scale: '1x', description: 'Standard size' },
        { id: 'large', name: 'Large', scale: '1.125x', description: 'Easier to read' },
        { id: 'xl', name: 'Extra Large', scale: '1.25x', description: 'Large text' },
        { id: 'xxl', name: 'XXL', scale: '1.5x', description: 'Very large text' }
    ];

    const cursorSizeOptions = [
        { id: 'small', name: 'Small', description: 'Compact cursor' },
        { id: 'normal', name: 'Normal', description: 'Standard size' },
        { id: 'large', name: 'Large', description: 'Easier to see' },
        { id: 'xl', name: 'Extra Large', description: 'High visibility' }
    ];

    const clickDelayOptions = [
        { id: 'fast', name: 'Fast', time: '0ms', description: 'Immediate response' },
        { id: 'normal', name: 'Normal', time: '100ms', description: 'Standard delay' },
        { id: 'slow', name: 'Slow', time: '300ms', description: 'Prevents accidental clicks' },
        { id: 'very-slow', name: 'Very Slow', time: '500ms', description: 'Maximum delay' }
    ];

    const scrollSpeedOptions = [
        { id: 'slow', name: 'Slow', description: 'Gentle scrolling' },
        { id: 'medium', name: 'Medium', description: 'Standard speed' },
        { id: 'fast', name: 'Fast', description: 'Quick scrolling' }
    ];

    const colorAdjustmentOptions = [
        { id: 'none', name: 'None', description: 'No adjustment' },
        { id: 'protanopia', name: 'Protanopia', description: 'Red-blind friendly' },
        { id: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind friendly' },
        { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind friendly' },
        { id: 'monochrome', name: 'Monochrome', description: 'Grayscale only' }
    ];

    const readingSpeedOptions = [
        { id: 'slow', name: 'Slow', wpm: '150 WPM', description: 'Careful reading' },
        { id: 'normal', name: 'Normal', wpm: '200 WPM', description: 'Average speed' },
        { id: 'fast', name: 'Fast', wpm: '250 WPM', description: 'Quick reading' },
        { id: 'very-fast', name: 'Very Fast', wpm: '300 WPM', description: 'Speed reading' }
    ];

    const resetToDefaults = () => {
        setVideoQuality('auto');
        setAutoplay(true);
        setClosedCaptions(false);
        setAudioDescriptions(false);
        setKeyboardNavigation(true);
        setScreenReader(false);
        setHighContrast(false);
        setReducedMotion(false);
        setFocusIndicators(true);
        setFontSize('medium');
        setCursorSize('normal');
        setClickDelay('normal');
        setVoiceControl(false);
        setGestureControl(false);
        setAutoScrollSpeed('medium');
        setSkipDuration(10);
        setVolumeBoost(false);
        setColorAdjustment('none');
        setReadingSpeed('normal');
    };

    const saveSettings = () => {
        console.log('Saving accessibility settings...');
        // Here you would save settings to backend
    };

    return (
    <div>
            <div className="max-sm:w-full sm:px-4 sm:py-4 bg-white overflow-y-scroll scrollBar max-md:h-[calc(100vh-53px)] h-[calc(100vh-65px)]">
              {/* Header */}
              <div className="mb-8 max-sm:p-2">
                  <h1 className="text-3xl max-sm:text-lg font-bold text-gray-900 mb-2 flex items-center">
                      <AccessibilityIcon className="mr-3 max-md:mr-1 h-8 w-8 max-md:w-5 max-md:h-5" />
                      Accessibility Settings
                  </h1>
                  <p className="text-gray-600 max-sm:text-sm">Configure accessibility features to improve your experience</p>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-sm:p-2 mb-8">
                  <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Setup</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                          onClick={() => {
                              setHighContrast(true);
                              setFontSize('large');
                              setFocusIndicators(true);
                          }}
                          className="p-4 max-sm:p-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                          <Eye className="h-6 w-6 text-blue-600 mb-2" />
                          <h3 className="font-medium text-blue-900">Vision Assistance</h3>
                          <p className="text-sm text-blue-700">High contrast, large text, focus indicators</p>
                      </button>

                      <button
                          onClick={() => {
                              setKeyboardNavigation(true);
                              setVoiceControl(true);
                              setClickDelay('slow');
                          }}
                            className="p-4 max-sm:p-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                          <Keyboard className="h-6 w-6 text-blue-600 mb-2" />
                          <h3 className="font-medium text-blue-900">Motor Assistance</h3>
                          <p className="text-sm text-blue-700">Keyboard nav, voice control, click delay</p>
                      </button>

                      <button
                          onClick={() => {
                              setClosedCaptions(true);
                              setAudioDescriptions(true);
                              setVolumeBoost(true);
                          }}
                            className="p-4 max-sm:p-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                          <Headphones className="h-6 w-6 text-blue-600 mb-2" />
                          <h3 className="font-medium text-blue-900">Hearing Assistance</h3>
                          <p className="text-sm text-blue-700">Captions, audio descriptions, volume boost</p>
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Video & Media Settings */}
                  <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <Video className="mr-2 h-5 w-5" />
                          Video & Media
                      </h2>

                      <div className="space-y-4">
                          {/* Default Video Quality */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Default Video Quality
                              </label>
                              <select
                                  value={videoQuality}
                                  onChange={(e) => setVideoQuality(e.target.value)}
                                  className="w-full max-sm:flex max-sm:items-center max-sm:justify-between px-3 max-sm:p-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                  {videoQualityOptions.map((option) => (
                                      <option key={option.id} value={option.id}>
                                          {option.name} - {option.description}
                                      </option>
                                  ))}
                              </select>
                              <p className="text-xs text-gray-600 mt-1">
                                  Higher quality uses more bandwidth. Auto adjusts based on your connection.
                              </p>
                          </div>

                          {/* Skip Duration */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Skip Duration (seconds)
                              </label>
                              <div className="flex items-center space-x-4">
                                  <input
                                      type="range"
                                      min="5"
                                      max="60"
                                      step="5"
                                      value={skipDuration}
                                      onChange={(e) => setSkipDuration(parseInt(e.target.value))}
                                      className="flex-1"
                                  />
                                  <span className="font-medium text-gray-900 w-12">{skipDuration}s</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                                  <SkipBack className="h-4 w-4" />
                                  <span>Use keyboard arrows to skip forward/backward</span>
                              </div>
                          </div>

                          {/* Media Controls */}
                          <div className="space-y-4 max-sm:space-y-2">
                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3 max-sm:space-x-2">
                                      <Play className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Autoplay Videos</h4>
                                          <p className="text-sm text-gray-600">Automatically start playing videos</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setAutoplay(!autoplay)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoplay ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoplay ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3 max-sm:space-x-2">
                                      <Volume2 className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Volume Boost</h4>
                                          <p className="text-sm text-gray-600">Enhance audio volume for better hearing</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setVolumeBoost(!volumeBoost)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${volumeBoost ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${volumeBoost ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Caption & Audio Settings */}
                  <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <Headphones className="mr-2 h-5 w-5" />
                          Captions & Audio
                      </h2>

                      <div className="space-y-4 max-sm:space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3 max-sm:space-x-2">
                                  <Type className="h-5 w-5 text-gray-600" />
                                  <div>
                                      <h4 className="font-medium text-gray-900">Closed Captions</h4>
                                      <p className="text-sm text-gray-600">Show text for spoken content</p>
                                  </div>
                              </div>
                              <button
                                  onClick={() => setClosedCaptions(!closedCaptions)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${closedCaptions ? 'bg-blue-600' : 'bg-gray-200'
                                      }`}
                              >
                                  <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${closedCaptions ? 'translate-x-6' : 'translate-x-1'
                                          }`}
                                  />
                              </button>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3 max-sm:space-x-2">
                                  <Mic className="h-5 w-5 text-gray-600" />
                                  <div>
                                      <h4 className="font-medium text-gray-900">Audio Descriptions</h4>
                                      <p className="text-sm text-gray-600">Narrated descriptions of visual content</p>
                                  </div>
                              </div>
                              <button
                                  onClick={() => setAudioDescriptions(!audioDescriptions)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${audioDescriptions ? 'bg-blue-600' : 'bg-gray-200'
                                      }`}
                              >
                                  <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${audioDescriptions ? 'translate-x-6' : 'translate-x-1'
                                          }`}
                                  />
                              </button>
                          </div>

                          {/* Reading Speed */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Text Reading Speed
                              </label>
                              <div className="space-y-2">
                                  {readingSpeedOptions.map((option) => (
                                      <button
                                          key={option.id}
                                          onClick={() => setReadingSpeed(option.id)}
                                          className={`w-full p-3 border rounded-lg text-left transition-colors ${readingSpeed === option.id
                                                  ? 'border-blue-500 bg-blue-50'
                                                  : 'border-gray-200 hover:border-gray-300'
                                              }`}
                                      >
                                          <div className="flex justify-between items-center">
                                              <span className="font-medium">{option.name}</span>
                                              <span className="text-sm text-gray-600">{option.wpm}</span>
                                          </div>
                                          <p className="text-xs text-gray-600">{option.description}</p>
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Visual Accessibility */}
                  <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <Eye className="mr-2 h-5 w-5" />
                          Visual Accessibility
                      </h2>

                      <div className="space-y-6">
                          {/* Font Size */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Text Size
                              </label>
                              <div className="grid grid-cols-1 gap-2">
                                  {fontSizeOptions.map((option) => (
                                      <button
                                          key={option.id}
                                          onClick={() => setFontSize(option.id)}
                                          className={`p-3 border rounded-lg text-left transition-colors ${fontSize === option.id
                                                  ? 'border-blue-500 bg-blue-50'
                                                  : 'border-gray-200 hover:border-gray-300'
                                              }`}
                                      >
                                          <div className="flex justify-between items-center">
                                              <span className="font-medium">{option.name}</span>
                                              <span className="text-sm text-gray-600">{option.scale}</span>
                                          </div>
                                          <p className="text-xs text-gray-600">{option.description}</p>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Color Adjustment */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Color Adjustment
                              </label>
                              <select
                                  value={colorAdjustment}
                                  onChange={(e) => setColorAdjustment(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                  {colorAdjustmentOptions.map((option) => (
                                      <option key={option.id} value={option.id}>
                                          {option.name} - {option.description}
                                      </option>
                                  ))}
                              </select>
                          </div>

                          {/* Visual Toggles */}
                          <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Monitor className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">High Contrast</h4>
                                          <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setHighContrast(!highContrast)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Zap className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Reduced Motion</h4>
                                          <p className="text-sm text-gray-600">Minimize animations and effects</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setReducedMotion(!reducedMotion)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Focus className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Focus Indicators</h4>
                                          <p className="text-sm text-gray-600">Highlight focused elements clearly</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setFocusIndicators(!focusIndicators)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${focusIndicators ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${focusIndicators ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Navigation & Control */}
                  <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <Navigation className="mr-2 h-5 w-5" />
                          Navigation & Control
                      </h2>

                      <div className="space-y-6">
                          {/* Cursor Size */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Cursor Size
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                  {cursorSizeOptions.map((option) => (
                                      <button
                                          key={option.id}
                                          onClick={() => setCursorSize(option.id)}
                                          className={`p-3 border rounded-lg text-left transition-colors ${cursorSize === option.id
                                                  ? 'border-blue-500 bg-blue-50'
                                                  : 'border-gray-200 hover:border-gray-300'
                                              }`}
                                      >
                                          <div className="font-medium">{option.name}</div>
                                          <p className="text-xs text-gray-600">{option.description}</p>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Click Delay */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Click Delay
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                  {clickDelayOptions.map((option) => (
                                      <button
                                          key={option.id}
                                          onClick={() => setClickDelay(option.id)}
                                          className={`p-3 border rounded-lg text-left transition-colors ${clickDelay === option.id
                                                  ? 'border-blue-500 bg-blue-50'
                                                  : 'border-gray-200 hover:border-gray-300'
                                              }`}
                                      >
                                          <div className="flex justify-between items-center">
                                              <span className="font-medium">{option.name}</span>
                                              <span className="text-xs text-gray-600">{option.time}</span>
                                          </div>
                                          <p className="text-xs text-gray-600">{option.description}</p>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Scroll Speed */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Auto Scroll Speed
                              </label>
                              <div className="space-y-2">
                                  {scrollSpeedOptions.map((option) => (
                                      <button
                                          key={option.id}
                                          onClick={() => setAutoScrollSpeed(option.id)}
                                          className={`w-full p-3 border rounded-lg text-left transition-colors ${autoScrollSpeed === option.id
                                                  ? 'border-blue-500 bg-blue-50'
                                                  : 'border-gray-200 hover:border-gray-300'
                                              }`}
                                      >
                                          <div className="font-medium">{option.name}</div>
                                          <p className="text-xs text-gray-600">{option.description}</p>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Navigation Controls */}
                          <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Keyboard className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Keyboard Navigation</h4>
                                          <p className="text-sm text-gray-600">Navigate using keyboard shortcuts</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setKeyboardNavigation(!keyboardNavigation)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Mic className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Voice Control</h4>
                                          <p className="text-sm text-gray-600">Control interface with voice commands</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setVoiceControl(!voiceControl)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${voiceControl ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${voiceControl ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Move className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Gesture Control</h4>
                                          <p className="text-sm text-gray-600">Use gestures to navigate</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setGestureControl(!gestureControl)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gestureControl ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gestureControl ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                      <Settings className="h-5 w-5 text-gray-600" />
                                      <div>
                                          <h4 className="font-medium text-gray-900">Screen Reader Support</h4>
                                          <p className="text-sm text-gray-600">Enhanced support for screen readers</p>
                                      </div>
                                  </div>
                                  <button
                                      onClick={() => setScreenReader(!screenReader)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${screenReader ? 'bg-blue-600' : 'bg-gray-200'
                                          }`}
                                  >
                                      <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${screenReader ? 'translate-x-6' : 'translate-x-1'
                                              }`}
                                      />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Keyboard Shortcuts Reference */}
              <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2 mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Keyboard className="mr-2 h-5 w-5" />
                      Keyboard Shortcuts
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Video Controls</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                  <span>Play/Pause:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Space</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Skip Forward:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">→</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Skip Backward:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">←</span>
                              </div>
                          </div>
                      </div>

                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Navigation</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                  <span>Next Element:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Tab</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Previous Element:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Shift+Tab</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Activate:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Enter</span>
                              </div>
                          </div>
                      </div>

                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Accessibility</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                  <span>Toggle Captions:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">C</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Increase Text:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl++</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Decrease Text:</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl+-</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-6 max-sm:mb-4 max-sm:mt-4">
                  <button
                      onClick={resetToDefaults}
                      className="flex items-center max-sm:px-3 max-sm:py-1.5 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                      <RotateCcw className="mr-2 max-sm:mr-1 h-4 w-4 max-sm:w-3" />
                      Reset to Defaults
                  </button>

                  <button
                      onClick={saveSettings}
                        className="flex items-center max-sm:px-3 max-sm:py-1.5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                        <Save className="mr-2 max-sm:mr-1 h-4 w-4 max-sm:w-3" />
                      Save Settings
                  </button>
              </div>

              {/* Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-sm:p-2">
                  <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                  <p className="text-blue-800 text-sm mb-3">
                      Our accessibility features are designed to make the platform usable for everyone.
                      If you need additional assistance or have suggestions for improvement, please contact our support team.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Contact Accessibility Support →
                  </button>
              </div>
          </div>
    </div>
  )
}

export default Accessibility
