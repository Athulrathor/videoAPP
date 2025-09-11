// import { useEffect } from 'react';

// export const useAppearance = ({
//     theme,
//     fontSize,
//     fontFamily,
//     layoutDensity,
//     accentColor,
//     animationsEnabled,
//     highContrast,
//     reducedMotion,
//     backgroundType,
//     customBackground
// }) => {
//     useEffect(() => {
//         const root = document.documentElement;
//         const body = document.body;

//         // Apply theme
//         root.classList.remove('light', 'dark');
//         if (theme === 'auto') {
//             const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//             root.classList.add(systemTheme);
//         } else {
//             root.classList.add(theme);
//         }

//         // Apply font family to body
//         body.style.fontFamily = `var(--font-${fontFamily})`;

//         // Apply font size to root
//         root.style.fontSize = `var(--font-size-${fontSize})`;

//         // Apply layout density
//         root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
//         root.classList.add(`density-${layoutDensity}`);

//         // Apply accent color
//         root.classList.remove('accent-blue', 'accent-purple', 'accent-green', 'accent-red', 'accent-orange', 'accent-pink', 'accent-indigo', 'accent-teal');
//         root.classList.add(`accent-${accentColor}`);

//         // High contrast
//         root.classList.toggle('high-contrast', highContrast);

//         // Reduced motion
//         root.classList.toggle('reduce-motion', reducedMotion);

//         // Background handling
//         if (backgroundType === 'custom' && customBackground) {
//             body.style.backgroundImage = `url(${customBackground})`;
//             body.style.backgroundSize = 'cover';
//             body.style.backgroundAttachment = 'fixed';
//             body.style.backgroundPosition = 'center';
//         } else {
//             body.style.backgroundImage = '';
//             body.classList.remove('bg-ocean', 'bg-sunset', 'bg-forest', 'bg-purple-haze');

//             const gradientMap = {
//                 gradient1: 'bg-ocean',
//                 gradient2: 'bg-sunset',
//                 gradient3: 'bg-forest',
//                 gradient4: 'bg-purple-haze'
//             };

//             if (gradientMap[backgroundType]) {
//                 body.classList.add(gradientMap[backgroundType]);
//             }
//         }

//         // Animation settings
//         root.style.setProperty('--transition-duration', animationsEnabled ? '150ms' : '0ms');

//     }, [theme, fontSize, fontFamily, layoutDensity, accentColor, animationsEnabled, highContrast, reducedMotion, backgroundType, customBackground]);
// };