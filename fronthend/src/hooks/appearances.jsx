// hooks/appearances.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppearanceContext = createContext();

export const useAppearance = () => {
    const context = useContext(AppearanceContext);
    if (!context) {
        throw new Error('useAppearance must be used within AppearanceProvider');
    }
    return context;
};

export const AppearanceProvider = ({ children }) => {
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'light',
        backgroundType: 'default',
        customBackground: '',
        fontSize: 'medium',
        fontFamily: 'inter',
        layoutDensity: 'comfortable',
        accentColor: 'blue',
        animationsEnabled: true,
        highContrast: false,
        reducedMotion: false,
        sidebarStyle: 'default'
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('appearanceSettings');
        if (savedSettings) {
            setAppearanceSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Apply settings to DOM whenever they change
    useEffect(() => {
        localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
        applySettingsToDOM(appearanceSettings);
    }, [appearanceSettings]);

    const applySettingsToDOM = (settings) => {
        const root = document.documentElement;
        const body = document.body;

        // Apply theme
        root.setAttribute('data-theme', settings.theme);

        // Apply font settings
        root.style.setProperty('--font-family', getFontFamily(settings.fontFamily));
        root.style.setProperty('--font-size-base', getFontSize(settings.fontSize));

        // Apply accent color
        root.style.setProperty('--accent-color', getAccentColor(settings.accentColor));

        // Apply layout density
        root.style.setProperty('--spacing-unit', getSpacing(settings.layoutDensity));

        // Apply background
        if (settings.backgroundType !== 'default') {
            root.style.setProperty('--background-image', getBackground(settings));
        } else {
            root.style.setProperty('--background-image', 'none');
        }

        // Apply accessibility settings
        if (settings.reducedMotion) {
            root.style.setProperty('--animation-duration', '0s');
            body.classList.add('reduced-motion');
        } else {
            root.style.setProperty('--animation-duration', settings.animationsEnabled ? '0.3s' : '0s');
            body.classList.remove('reduced-motion');
        }

        // Apply high contrast
        if (settings.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        // Apply font size class
        body.className = body.className.replace(/font-size-\w+/g, '');
        body.classList.add(`font-size-${settings.fontSize}`);

        // Apply density class
        body.className = body.className.replace(/density-\w+/g, '');
        body.classList.add(`density-${settings.layoutDensity}`);
    };

    // Auto theme detection
    useEffect(() => {
        if (appearanceSettings.theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            };

            handleChange(mediaQuery);
            mediaQuery.addEventListener('change', handleChange);

            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [appearanceSettings.theme]);

    // Helper functions
    const getFontFamily = (fontFamily) => {
        const fonts = {
            inter: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            roboto: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
            poppins: '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif',
            mono: '"Fira Code", "Consolas", monospace'
        };
        return fonts[fontFamily] || fonts.inter;
    };

    const getFontSize = (fontSize) => {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
            xl: '20px'
        };
        return sizes[fontSize] || sizes.medium;
    };

    const getAccentColor = (color) => {
        const colors = {
            blue: '#3b82f6',
            purple: '#8b5cf6',
            green: '#10b981',
            red: '#ef4444',
            orange: '#f97316',
            pink: '#ec4899',
            indigo: '#6366f1',
            teal: '#14b8a6'
        };
        return colors[color] || colors.blue;
    };

    const getSpacing = (density) => {
        const spacing = {
            compact: '0.5rem',
            comfortable: '1rem',
            spacious: '1.5rem'
        };
        return spacing[density] || spacing.comfortable;
    };

    const getBackground = (settings) => {
        if (settings.backgroundType === 'custom' && settings.customBackground) {
            return `url(${settings.customBackground})`;
        }

        const gradients = {
            gradient1: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
            gradient2: 'linear-gradient(135deg, #fb923c 0%, #ef4444 50%, #ec4899 100%)',
            gradient3: 'linear-gradient(135deg, #4ade80 0%, #10b981 50%, #059669 100%)',
            gradient4: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #6366f1 100%)'
        };

        return gradients[settings.backgroundType] || 'none';
    };

    return (
        <AppearanceContext.Provider value={{
            appearanceSettings,
            setAppearanceSettings
        }}>
            {children}
        </AppearanceContext.Provider>
    );
};
