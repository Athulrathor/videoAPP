
import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Image,
  Type,
  Layout,
  Eye,
  Zap,
  Download,
  Upload,
  RotateCcw,
  Check,
  Settings,
  Maximize,
  Grid,
  Sidebar,
  Square
} from 'lucide-react';

const Appearance = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [backgroundType, setBackgroundType] = useState('default');
  const [customBackground, setCustomBackground] = useState('');
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('inter');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [accentColor, setAccentColor] = useState('blue');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState('default');

  const themeOptions = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: Sun,
      preview: 'bg-white border-gray-200',
      description: 'Clean and bright interface'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: Moon,
      preview: 'bg-gray-900 border-gray-700',
      description: 'Easy on the eyes in low light'
    },
    {
      id: 'auto',
      name: 'Auto',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400',
      description: 'Follows your system preference'
    }
  ];

  const backgroundOptions = [
    {
      id: 'default',
      name: 'Default',
      preview: 'bg-white',
      description: 'Clean default background'
    },
    {
      id: 'gradient1',
      name: 'Ocean Breeze',
      preview: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      description: 'Calming blue gradient'
    },
    {
      id: 'gradient2',
      name: 'Sunset',
      preview: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
      description: 'Warm sunset colors'
    },
    {
      id: 'gradient3',
      name: 'Forest',
      preview: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
      description: 'Natural green tones'
    },
    {
      id: 'gradient4',
      name: 'Purple Haze',
      preview: 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600',
      description: 'Rich purple gradient'
    },
    {
      id: 'pattern1',
      name: 'Geometric',
      preview: 'bg-gray-100',
      description: 'Subtle geometric pattern',
      pattern: true
    },
    {
      id: 'custom',
      name: 'Custom Image',
      preview: 'bg-gray-200',
      description: 'Upload your own background'
    }
  ];

  const accentColors = [
    { id: 'blue', color: 'bg-blue-500', name: 'Blue' },
    { id: 'purple', color: 'bg-purple-500', name: 'Purple' },
    { id: 'green', color: 'bg-green-500', name: 'Green' },
    { id: 'red', color: 'bg-red-500', name: 'Red' },
    { id: 'orange', color: 'bg-orange-500', name: 'Orange' },
    { id: 'pink', color: 'bg-pink-500', name: 'Pink' },
    { id: 'indigo', color: 'bg-indigo-500', name: 'Indigo' },
    { id: 'teal', color: 'bg-teal-500', name: 'Teal' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', sample: 'text-sm', description: '14px base size' },
    { id: 'medium', name: 'Medium', sample: 'text-base', description: '16px base size' },
    { id: 'large', name: 'Large', sample: 'text-lg', description: '18px base size' },
    { id: 'xl', name: 'Extra Large', sample: 'text-xl', description: '20px base size' }
  ];

  const fontFamilies = [
    { id: 'inter', name: 'Inter', class: 'font-sans', description: 'Modern and clean' },
    { id: 'roboto', name: 'Roboto', class: 'font-sans', description: 'Google\'s material font' },
    { id: 'poppins', name: 'Poppins', class: 'font-sans', description: 'Rounded and friendly' },
    { id: 'mono', name: 'Monospace', class: 'font-mono', description: 'Fixed-width characters' }
  ];

  const layoutOptions = [
    { id: 'compact', name: 'Compact', description: 'More content, less spacing' },
    { id: 'comfortable', name: 'Comfortable', description: 'Balanced spacing' },
    { id: 'spacious', name: 'Spacious', description: 'Extra breathing room' }
  ];

  const sidebarOptions = [
    { id: 'default', name: 'Default', icon: Sidebar, description: 'Standard sidebar' },
    { id: 'minimal', name: 'Minimal', icon: Square, description: 'Icons only' },
    { id: 'floating', name: 'Floating', icon: Grid, description: 'Floating cards style' }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target.result);
        setBackgroundType('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaults = () => {
    setCurrentTheme('light');
    setBackgroundType('default');
    setCustomBackground('');
    setFontSize('medium');
    setFontFamily('inter');
    setLayoutDensity('comfortable');
    setAccentColor('blue');
    setAnimationsEnabled(true);
    setHighContrast(false);
    setReducedMotion(false);
    setSidebarStyle('default');
  };

  const exportSettings = () => {
    const settings = {
      theme: currentTheme,
      background: backgroundType,
      customBackground,
      fontSize,
      fontFamily,
      layoutDensity,
      accentColor,
      animationsEnabled,
      highContrast,
      reducedMotion,
      sidebarStyle
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'appearance-settings.json';
    link.click();
  };

  const getPreviewBackground = () => {
    if (backgroundType === 'custom' && customBackground) {
      return { backgroundImage: `url(${customBackground})`, backgroundSize: 'cover' };
    }

    const option = backgroundOptions.find(opt => opt.id === backgroundType);
    return {};
  };

  return (
    <div>
      <div className="max-sm:w-full sm:px-4 sm:py-4 bg-white overflow-y-scroll scrollBar max-md:h-[calc(100vh-53px)] h-[calc(100vh-65px)]">
        {/* Header */}
        <div className="mb-6 max-sm:p-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appearance Settings</h1>
          <p className="text-gray-600 max-sm:text-sm">Customize the look and feel of your interface</p>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Live Preview
          </h2>

          <div
            className={`w-full h-48 rounded-lg border-2 p-4 ${backgroundOptions.find(opt => opt.id === backgroundType)?.preview || 'bg-white'
              }`}
            style={getPreviewBackground()}
          >
            <div className="bg-white bg-opacity-90 rounded-lg p-4 h-full flex items-center justify-center">
              <div className={`text-center ${fontFamilies.find(f => f.id === fontFamily)?.class}`}>
                <h3 className={`font-bold ${fontSizes.find(f => f.id === fontSize)?.sample} mb-2`}>
                  Preview Interface
                </h3>
                <p className="text-gray-600">
                  This is how your interface will look with current settings
                </p>
                <button className={`mt-3 px-4 py-2 ${accentColors.find(c => c.id === accentColor)?.color} text-white rounded-lg`}>
                  Sample Button
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={resetToDefaults}
              className="flex items-center px-4 max-sm:text-sm max-sm:px-2 max-sm:py-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="mr-2 h-4 w-4 max-sm:w-3" />
              Reset to Defaults
            </button>
            <button
              onClick={exportSettings}
              className="flex items-center max-sm:px-2 max-sm:text-sm max-sm:py-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="mr-2 h-4 w-4 max-sm:w-3" />
              Export Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Selection */}
          <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Color Theme
            </h2>

            <div className="space-y-3">
              {themeOptions.map((theme) => {
                const Icon = theme.icon;
                return (
                  <div
                    key={theme.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${currentTheme === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setCurrentTheme(theme.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-8 rounded ${theme.preview} border flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{theme.name}</h3>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Background Options */}
          <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Background
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {backgroundOptions.map((bg) => (
                <div
                  key={bg.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${backgroundType === bg.id
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setBackgroundType(bg.id)}
                >
                  <div className={`w-full h-16 rounded ${bg.preview} border mb-2 flex items-center justify-center`}>
                    {bg.pattern && <div className="text-xs text-gray-500">Pattern</div>}
                    {bg.id === 'custom' && <Upload className="h-6 w-6 text-gray-400" />}
                  </div>
                  <h4 className="font-medium text-sm text-gray-900">{bg.name}</h4>
                  <p className="text-xs text-gray-600">{bg.description}</p>
                </div>
              ))}
            </div>

            {backgroundType === 'custom' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Custom Background
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Typography */}
          <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Type className="mr-2 h-5 w-5" />
              Typography
            </h2>

            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setFontSize(size.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${fontSize === size.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className={`font-medium ${size.sample}`}>{size.name}</div>
                      <div className="text-xs text-gray-600">{size.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Family</label>
                <div className="space-y-2">
                  {fontFamilies.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setFontFamily(font.id)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${fontFamily === font.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className={`font-medium ${font.class}`}>{font.name}</div>
                      <div className="text-xs text-gray-600">{font.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layout & Spacing */}
          <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Layout className="mr-2 h-5 w-5" />
              Layout & Spacing
            </h2>

            <div className="space-y-6">
              {/* Layout Density */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Layout Density</label>
                <div className="space-y-2">
                  {layoutOptions.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setLayoutDensity(layout.id)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${layoutDensity === layout.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="font-medium">{layout.name}</div>
                      <div className="text-xs text-gray-600">{layout.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sidebar Style</label>
                <div className="space-y-2">
                  {sidebarOptions.map((style) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSidebarStyle(style.id)}
                        className={`w-full p-3 border rounded-lg text-left transition-colors flex items-center space-x-3 ${sidebarStyle === style.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{style.name}</div>
                          <div className="text-xs text-gray-600">{style.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Accent Colors */}
          <div className="bg-gray-50 rounded-lg p-6 max-sm:p-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Accent Color
            </h2>

            <div className="grid grid-cols-4 max-sm:grid-col-3 py-3 gap-3 max-sm:gap-2">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`p-2 max-sm:p-1  border-2 rounded-lg transition-all ${accentColor === color.id
                      ? 'border-gray-400 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className={`w-full h-8 rounded ${color.color} mb-2`}></div>
                  <div className="text-xs font-medium text-gray-900">{color.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility & Animation */}
          <div className="bg-gray-50 rounded-lg p-6 max-md:p-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Animation & Accessibility
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 max-sm:p-2 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Animations</h3>
                  <p className="text-sm text-gray-600">Enable smooth transitions and effects</p>
                </div>
                <button
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${animationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 max-sm:p-2 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">High Contrast</h3>
                  <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
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

              <div className="flex items-center justify-between p-4 max-sm:p-2 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Reduced Motion</h3>
                  <p className="text-sm text-gray-600">Minimize motion for accessibility</p>
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
            </div>
          </div>
        </div>

        {/* Apply Settings Button */}
        <div className="mt-4 flex justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Apply All Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Appearance
