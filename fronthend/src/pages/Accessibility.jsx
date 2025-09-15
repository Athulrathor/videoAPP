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
import { useAppearance } from '../hooks/appearances';

const Accessibility = () => {
    const { appearanceSettings } = useAppearance();

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

    // All your existing options arrays remain the same...
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
        <div
            className="max-sm:w-full sm:px-4 sm:py-4 overflow-y-scroll scrollBar max-md:h-[calc(100vh-53px)] h-[calc(100vh-65px)] transition-all"
            style={{
                backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)',
                transitionDuration: 'var(--animation-duration)'
            }}
        >
            {/* Header */}
            <div
                className="mb-8 max-sm:p-2"
                style={{ marginBottom: 'var(--section-gap)' }}
            >
                <h1
                    className="text-3xl max-sm:text-lg font-bold mb-2 flex items-center"
                    style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-3xl)',
                        fontFamily: 'var(--font-family)'
                    }}
                >
                    <AccessibilityIcon className="mr-3 max-md:mr-1 h-8 w-8 max-md:w-5 max-md:h-5" />
                    Accessibility Settings
                </h1>
                <p
                    className="max-sm:text-sm"
                    style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                    }}
                >
                    Configure accessibility features to improve your experience
                </p>
            </div>

            {/* Quick Actions */}
            <div
                className="border rounded-lg p-6 max-sm:p-2 mb-8 transition-all"
                style={{
                    backgroundColor: 'var(--color-accent-bg)',
                    borderColor: 'var(--accent-color)',
                    marginBottom: 'var(--section-gap)',
                    transitionDuration: 'var(--animation-duration)'
                }}
            >
                <h2
                    className="text-lg font-semibold mb-4"
                    style={{
                        color: 'var(--accent-color)',
                        fontSize: 'var(--font-size-lg)'
                    }}
                >
                    Quick Setup
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => {
                            setHighContrast(true);
                            setFontSize('large');
                            setFocusIndicators(true);
                        }}
                        className="p-4 max-sm:p-2 border rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--accent-color)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--color-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        }}
                    >
                        <Eye
                            className="h-6 w-6 mb-2"
                            style={{ color: 'var(--accent-color)' }}
                        />
                        <h3
                            className="font-medium"
                            style={{ color: 'var(--accent-color)' }}
                        >
                            Vision Assistance
                        </h3>
                        <p
                            className="text-sm"
                            style={{
                                color: 'var(--accent-color)',
                                opacity: '0.8',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            High contrast, large text, focus indicators
                        </p>
                    </button>

                    <button
                        onClick={() => {
                            setKeyboardNavigation(true);
                            setVoiceControl(true);
                            setClickDelay('slow');
                        }}
                        className="p-4 max-sm:p-2 border rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--accent-color)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--color-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        }}
                    >
                        <Keyboard
                            className="h-6 w-6 mb-2"
                            style={{ color: 'var(--accent-color)' }}
                        />
                        <h3
                            className="font-medium"
                            style={{ color: 'var(--accent-color)' }}
                        >
                            Motor Assistance
                        </h3>
                        <p
                            className="text-sm"
                            style={{
                                color: 'var(--accent-color)',
                                opacity: '0.8',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            Keyboard nav, voice control, click delay
                        </p>
                    </button>

                    <button
                        onClick={() => {
                            setClosedCaptions(true);
                            setAudioDescriptions(true);
                            setVolumeBoost(true);
                        }}
                        className="p-4 max-sm:p-2 border rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--accent-color)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--color-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--color-bg-primary)';
                        }}
                    >
                        <Headphones
                            className="h-6 w-6 mb-2"
                            style={{ color: 'var(--accent-color)' }}
                        />
                        <h3
                            className="font-medium"
                            style={{ color: 'var(--accent-color)' }}
                        >
                            Hearing Assistance
                        </h3>
                        <p
                            className="text-sm"
                            style={{
                                color: 'var(--accent-color)',
                                opacity: '0.8',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            Captions, audio descriptions, volume boost
                        </p>
                    </button>
                </div>
            </div>

            <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                style={{ gap: 'var(--section-gap)' }}
            >
                {/* Video & Media Settings */}
                <div
                    className="rounded-lg p-6 max-sm:p-2 transition-all"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        padding: 'var(--component-padding)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                >
                    <h2
                        className="text-xl font-semibold mb-6 flex items-center"
                        style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-xl)',
                            marginBottom: 'var(--component-padding)'
                        }}
                    >
                        <Video className="mr-2 h-5 w-5" />
                        Video & Media
                    </h2>

                    <div className="space-y-4">
                        {/* Default Video Quality */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Default Video Quality
                            </label>
                            <select
                                value={videoQuality}
                                onChange={(e) => setVideoQuality(e.target.value)}
                                className="w-full max-sm:flex max-sm:items-center max-sm:justify-between px-3 max-sm:p-2 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-primary)',
                                    fontFamily: 'var(--font-family)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent-color)';
                                    e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--color-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {videoQualityOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name} - {option.description}
                                    </option>
                                ))}
                            </select>
                            <p
                                className="text-xs mt-1"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-xs)'
                                }}
                            >
                                Higher quality uses more bandwidth. Auto adjusts based on your connection.
                            </p>
                        </div>

                        {/* Skip Duration */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
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
                                    style={{
                                        accentColor: 'var(--accent-color)'
                                    }}
                                />
                                <span
                                    className="font-medium w-12"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {skipDuration}s
                                </span>
                            </div>
                            <div
                                className="flex items-center space-x-2 mt-2 text-sm"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                <SkipBack className="h-4 w-4" />
                                <span>Use keyboard arrows to skip forward/backward</span>
                            </div>
                        </div>

                        {/* Media Controls */}
                        <div className="space-y-4 max-sm:space-y-2">
                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3 max-sm:space-x-2">
                                    <Play
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Autoplay Videos
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Automatically start playing videos
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAutoplay(!autoplay)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: autoplay ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: autoplay ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3 max-sm:space-x-2">
                                    <Volume2
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Volume Boost
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Enhance audio volume for better hearing
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setVolumeBoost(!volumeBoost)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: volumeBoost ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: volumeBoost ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Caption & Audio Settings */}
                <div
                    className="rounded-lg p-6 max-sm:p-2 transition-all"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        padding: 'var(--component-padding)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                >
                    <h2
                        className="text-xl font-semibold mb-6 flex items-center"
                        style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-xl)',
                            marginBottom: 'var(--component-padding)'
                        }}
                    >
                        <Headphones className="mr-2 h-5 w-5" />
                        Captions & Audio
                    </h2>

                    <div className="space-y-4 max-sm:space-y-2">
                        <div
                            className="flex items-center justify-between p-3 border rounded-lg transition-all"
                            style={{
                                backgroundColor: 'var(--color-bg-primary)',
                                borderColor: 'var(--color-border)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                        >
                            <div className="flex items-center space-x-3 max-sm:space-x-2">
                                <Type
                                    className="h-5 w-5"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                />
                                <div>
                                    <h4
                                        className="font-medium"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        Closed Captions
                                    </h4>
                                    <p
                                        className="text-sm"
                                        style={{
                                            color: 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-sm)'
                                        }}
                                    >
                                        Show text for spoken content
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setClosedCaptions(!closedCaptions)}
                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                style={{
                                    backgroundColor: closedCaptions ? 'var(--accent-color)' : 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <span
                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                    style={{
                                        transform: closedCaptions ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                />
                            </button>
                        </div>

                        <div
                            className="flex items-center justify-between p-3 border rounded-lg transition-all"
                            style={{
                                backgroundColor: 'var(--color-bg-primary)',
                                borderColor: 'var(--color-border)',
                                transitionDuration: 'var(--animation-duration)'
                            }}
                        >
                            <div className="flex items-center space-x-3 max-sm:space-x-2">
                                <Mic
                                    className="h-5 w-5"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                />
                                <div>
                                    <h4
                                        className="font-medium"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        Audio Descriptions
                                    </h4>
                                    <p
                                        className="text-sm"
                                        style={{
                                            color: 'var(--color-text-secondary)',
                                            fontSize: 'var(--font-size-sm)'
                                        }}
                                    >
                                        Narrated descriptions of visual content
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAudioDescriptions(!audioDescriptions)}
                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                style={{
                                    backgroundColor: audioDescriptions ? 'var(--accent-color)' : 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <span
                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                    style={{
                                        transform: audioDescriptions ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                />
                            </button>
                        </div>

                        {/* Reading Speed */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Text Reading Speed
                            </label>
                            <div className="space-y-2">
                                {readingSpeedOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setReadingSpeed(option.id)}
                                        className="w-full p-3 border rounded-lg text-left transition-all"
                                        style={{
                                            backgroundColor: readingSpeed === option.id
                                                ? 'var(--color-accent-bg)'
                                                : 'var(--color-bg-primary)',
                                            borderColor: readingSpeed === option.id
                                                ? 'var(--accent-color)'
                                                : 'var(--color-border)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (readingSpeed !== option.id) {
                                                e.target.style.borderColor = 'var(--color-text-secondary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (readingSpeed !== option.id) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span
                                                className="font-medium"
                                                style={{ color: 'var(--color-text-primary)' }}
                                            >
                                                {option.name}
                                            </span>
                                            <span
                                                className="text-sm"
                                                style={{
                                                    color: 'var(--color-text-secondary)',
                                                    fontSize: 'var(--font-size-sm)'
                                                }}
                                            >
                                                {option.wpm}
                                            </span>
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-xs)'
                                            }}
                                        >
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Accessibility */}
                <div
                    className="rounded-lg p-6 max-sm:p-2 transition-all"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        padding: 'var(--component-padding)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                >
                    <h2
                        className="text-xl font-semibold mb-6 flex items-center"
                        style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-xl)',
                            marginBottom: 'var(--component-padding)'
                        }}
                    >
                        <Eye className="mr-2 h-5 w-5" />
                        Visual Accessibility
                    </h2>

                    <div className="space-y-6">
                        {/* Font Size */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Text Size
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {fontSizeOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFontSize(option.id)}
                                        className="p-3 border rounded-lg text-left transition-all"
                                        style={{
                                            backgroundColor: fontSize === option.id
                                                ? 'var(--color-accent-bg)'
                                                : 'var(--color-bg-primary)',
                                            borderColor: fontSize === option.id
                                                ? 'var(--accent-color)'
                                                : 'var(--color-border)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (fontSize !== option.id) {
                                                e.target.style.borderColor = 'var(--color-text-secondary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (fontSize !== option.id) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span
                                                className="font-medium"
                                                style={{ color: 'var(--color-text-primary)' }}
                                            >
                                                {option.name}
                                            </span>
                                            <span
                                                className="text-sm"
                                                style={{
                                                    color: 'var(--color-text-secondary)',
                                                    fontSize: 'var(--font-size-sm)'
                                                }}
                                            >
                                                {option.scale}
                                            </span>
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-xs)'
                                            }}
                                        >
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Adjustment */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Color Adjustment
                            </label>
                            <select
                                value={colorAdjustment}
                                onChange={(e) => setColorAdjustment(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-primary)',
                                    fontFamily: 'var(--font-family)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent-color)';
                                    e.target.style.boxShadow = '0 0 0 2px var(--accent-color)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--color-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
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
                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Monitor
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            High Contrast
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Increase contrast for better visibility
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setHighContrast(!highContrast)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: highContrast ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: highContrast ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Zap
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Reduced Motion
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Minimize animations and effects
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setReducedMotion(!reducedMotion)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: reducedMotion ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: reducedMotion ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Focus
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Focus Indicators
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Highlight focused elements clearly
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFocusIndicators(!focusIndicators)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: focusIndicators ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: focusIndicators ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation & Control */}
                <div
                    className="rounded-lg p-6 max-sm:p-2 transition-all"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        padding: 'var(--component-padding)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                >
                    <h2
                        className="text-xl font-semibold mb-6 flex items-center"
                        style={{
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-xl)',
                            marginBottom: 'var(--component-padding)'
                        }}
                    >
                        <Navigation className="mr-2 h-5 w-5" />
                        Navigation & Control
                    </h2>

                    <div className="space-y-6">
                        {/* Cursor Size */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Cursor Size
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {cursorSizeOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setCursorSize(option.id)}
                                        className="p-3 border rounded-lg text-left transition-all"
                                        style={{
                                            backgroundColor: cursorSize === option.id
                                                ? 'var(--color-accent-bg)'
                                                : 'var(--color-bg-primary)',
                                            borderColor: cursorSize === option.id
                                                ? 'var(--accent-color)'
                                                : 'var(--color-border)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (cursorSize !== option.id) {
                                                e.target.style.borderColor = 'var(--color-text-secondary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (cursorSize !== option.id) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                            }
                                        }}
                                    >
                                        <div
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            {option.name}
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-xs)'
                                            }}
                                        >
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Click Delay */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Click Delay
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {clickDelayOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setClickDelay(option.id)}
                                        className="p-3 border rounded-lg text-left transition-all"
                                        style={{
                                            backgroundColor: clickDelay === option.id
                                                ? 'var(--color-accent-bg)'
                                                : 'var(--color-bg-primary)',
                                            borderColor: clickDelay === option.id
                                                ? 'var(--accent-color)'
                                                : 'var(--color-border)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (clickDelay !== option.id) {
                                                e.target.style.borderColor = 'var(--color-text-secondary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (clickDelay !== option.id) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span
                                                className="font-medium"
                                                style={{ color: 'var(--color-text-primary)' }}
                                            >
                                                {option.name}
                                            </span>
                                            <span
                                                className="text-xs"
                                                style={{
                                                    color: 'var(--color-text-secondary)',
                                                    fontSize: 'var(--font-size-xs)'
                                                }}
                                            >
                                                {option.time}
                                            </span>
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-xs)'
                                            }}
                                        >
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scroll Speed */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-sm)'
                                }}
                            >
                                Auto Scroll Speed
                            </label>
                            <div className="space-y-2">
                                {scrollSpeedOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setAutoScrollSpeed(option.id)}
                                        className="w-full p-3 border rounded-lg text-left transition-all"
                                        style={{
                                            backgroundColor: autoScrollSpeed === option.id
                                                ? 'var(--color-accent-bg)'
                                                : 'var(--color-bg-primary)',
                                            borderColor: autoScrollSpeed === option.id
                                                ? 'var(--accent-color)'
                                                : 'var(--color-border)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (autoScrollSpeed !== option.id) {
                                                e.target.style.borderColor = 'var(--color-text-secondary)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (autoScrollSpeed !== option.id) {
                                                e.target.style.borderColor = 'var(--color-border)';
                                            }
                                        }}
                                    >
                                        <div
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            {option.name}
                                        </div>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-xs)'
                                            }}
                                        >
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="space-y-3">
                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Keyboard
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Keyboard Navigation
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Navigate using keyboard shortcuts
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setKeyboardNavigation(!keyboardNavigation)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: keyboardNavigation ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: keyboardNavigation ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Mic
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Voice Control
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Control interface with voice commands
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setVoiceControl(!voiceControl)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: voiceControl ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: voiceControl ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Move
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Gesture Control
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Use gestures to navigate
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setGestureControl(!gestureControl)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: gestureControl ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: gestureControl ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 border rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border)',
                                    transitionDuration: 'var(--animation-duration)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Settings
                                        className="h-5 w-5"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    />
                                    <div>
                                        <h4
                                            className="font-medium"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Screen Reader Support
                                        </h4>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-sm)'
                                            }}
                                        >
                                            Enhanced support for screen readers
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setScreenReader(!screenReader)}
                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                    style={{
                                        backgroundColor: screenReader ? 'var(--accent-color)' : 'var(--color-border)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                >
                                    <span
                                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                        style={{
                                            transform: screenReader ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                            transitionDuration: 'var(--animation-duration)'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyboard Shortcuts Reference */}
            <div
                className="rounded-lg p-6 max-sm:p-2 mt-8 transition-all"
                style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    padding: 'var(--component-padding)',
                    marginTop: 'var(--section-gap)',
                    transitionDuration: 'var(--animation-duration)'
                }}
            >
                <h2
                    className="text-xl font-semibold mb-4 flex items-center"
                    style={{
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-xl)'
                    }}
                >
                    <Keyboard className="mr-2 h-5 w-5" />
                    Keyboard Shortcuts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                        className="p-3 border rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <h4
                            className="font-medium mb-2"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Video Controls
                        </h4>
                        <div
                            className="space-y-1 text-sm"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            <div className="flex justify-between">
                                <span>Play/Pause:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    Space
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Skip Forward:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    →
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Skip Backward:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    ←
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-3 border rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <h4
                            className="font-medium mb-2"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Navigation
                        </h4>
                        <div
                            className="space-y-1 text-sm"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            <div className="flex justify-between">
                                <span>Next Element:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    Tab
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Previous Element:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    Shift+Tab
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Activate:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    Enter
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-3 border rounded-lg transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        <h4
                            className="font-medium mb-2"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            Accessibility
                        </h4>
                        <div
                            className="space-y-1 text-sm"
                            style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            <div className="flex justify-between">
                                <span>Toggle Captions:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    C
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Increase Text:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    Ctrl++
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Decrease Text:</span>
                                <span
                                    className="font-mono px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    Ctrl+-
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-6 max-sm:mb-4 max-sm:mt-4">
                <button
                    onClick={resetToDefaults}
                    className="flex items-center max-sm:px-3 max-sm:py-1.5 px-6 py-3 border rounded-lg transition-all"
                    style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-hover)';
                        e.target.style.color = 'var(--color-text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--color-text-secondary)';
                    }}
                >
                    <RotateCcw className="mr-2 max-sm:mr-1 h-4 w-4 max-sm:w-3" />
                    Reset to Defaults
                </button>

                <button
                    onClick={saveSettings}
                    className="flex items-center max-sm:px-3 max-sm:py-1.5 px-6 py-3 text-white rounded-lg transition-all"
                    style={{
                        backgroundColor: 'var(--accent-color)',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    <Save className="mr-2 max-sm:mr-1 h-4 w-4 max-sm:w-3" />
                    Save Settings
                </button>
            </div>

            {/* Help Section */}
            <div
                className="border rounded-lg p-6 max-sm:p-2 transition-all"
                style={{
                    backgroundColor: 'var(--color-accent-bg)',
                    borderColor: 'var(--accent-color)',
                    transitionDuration: 'var(--animation-duration)'
                }}
            >
                <h3
                    className="font-semibold mb-2"
                    style={{
                        color: 'var(--accent-color)',
                        fontSize: 'var(--font-size-base)'
                    }}
                >
                    Need Help?
                </h3>
                <p
                    className="text-sm mb-3"
                    style={{
                        color: 'var(--accent-color)',
                        fontSize: 'var(--font-size-sm)',
                        opacity: '0.8'
                    }}
                >
                    Our accessibility features are designed to make the platform usable for everyone.
                    If you need additional assistance or have suggestions for improvement, please contact our support team.
                </p>
                <button
                    className="font-medium text-sm transition-colors"
                    style={{
                        color: 'var(--accent-color)',
                        fontSize: 'var(--font-size-sm)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.opacity = '1';
                    }}
                >
                    Contact Accessibility Support →
                </button>
            </div>
        </div>
    )
}

export default Accessibility;
