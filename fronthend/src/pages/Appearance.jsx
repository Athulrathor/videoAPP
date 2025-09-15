import React from 'react';
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
  Grid,
  Sidebar,
  Square
} from 'lucide-react';
import { useAppearance } from '../hooks/appearances';
import { useDispatch, useSelector } from 'react-redux';
import { setApperances } from '../redux/features/settings';

const Appearance = () => {
  const dispatch = useDispatch();

  const { appearanceSettings, setAppearanceSettings } = useAppearance();
  const { appearances } = useSelector(state => state.settings);

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
        setAppearanceSettings(prev => ({
          ...prev,
          customBackground: e.target.result,
          backgroundType: 'custom'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaults = () => {
    setAppearanceSettings({
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
      sidebarStyle: 'default',
    });
  };

  const getPreviewBackground = () => {
    if (appearanceSettings.backgroundType === 'custom' && appearanceSettings.customBackground) {
      return { backgroundImage: `url(${appearanceSettings.customBackground})`, backgroundSize: 'cover' };
    }
    return {};
  };

  console.log(appearances)

  const handleApplySettings = () => {
    console.log('Settings applied:', appearanceSettings);
    dispatch(setApperances(appearanceSettings));
  };

  return (
    <div
      className="max-sm:w-full sm:px-4 sm:py-4 overflow-y-scroll scrollBar max-md:h-[calc(100vh-41px)] h-[calc(100vh-57px)] transition-all"
      style={{
        backgroundColor: appearanceSettings.customBackground ? 'transparent' : "var(--color-bg-primary)",
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--font-size-base)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {/* Header */}
      <div
        className="mb-6 max-sm:p-2"
        style={{
          marginBottom: 'var(--section-gap)',
          padding: 'var(--spacing-unit)'
        }}
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-3xl)'
          }}
        >
          Appearance Settings
        </h1>
        <p
          className="max-sm:text-sm"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          Customize the look and feel of your interface
        </p>
      </div>

      {/* Preview Section */}
      <div
        className="rounded-lg p-6 max-sm:p-2 mb-8 transition-colors"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          marginBottom: 'var(--section-gap)',
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
          <Eye className="mr-2 h-5 w-5" />
          Live Preview
        </h2>

        <div
          className={`w-full h-48 rounded-lg border-2 p-4 transition-all ${backgroundOptions.find(opt => opt.id === appearanceSettings.backgroundType)?.preview || 'bg-white'
            }`}
          style={{
            ...getPreviewBackground(),
            border: '2px solid var(--color-border)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <div
            className="bg-white bg-opacity-90 rounded-lg p-4 h-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(var(--color-bg-primary), 0.9)'
            }}
          >
            <div
              className={`text-center ${fontFamilies.find(f => f.id === appearanceSettings.fontFamily)?.class}`}
              style={{ fontFamily: 'var(--font-family)' }}
            >
              <h3
                className={`font-bold ${fontSizes.find(f => f.id === appearanceSettings.fontSize)?.sample} mb-2`}
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-base)'
                }}
              >
                Preview Interface
              </h3>
              <p
                className="mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                This is how your interface will look with current settings
              </p>
              <button
                className={`mt-3 px-4 py-2 text-white rounded-lg transition-all ${accentColors.find(c => c.id === appearanceSettings.accentColor)?.color
                  }`}
                style={{
                  backgroundColor: 'var(--accent-color)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={resetToDefaults}
            className="flex items-center px-4 max-sm:text-sm max-sm:px-2 max-sm:py-1 py-2 border rounded-lg transition-colors"
            style={{
              color: 'var(--color-text-secondary)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'transparent',
              fontSize: 'var(--font-size-sm)',
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
            <RotateCcw className="mr-2 h-4 w-4 max-sm:w-3" />
            Reset to Defaults
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        style={{ gap: 'var(--section-gap)' }}
      >
        {/* Theme Selection */}
        <div
          className="rounded-lg p-6 max-sm:p-2 transition-colors"
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
            <Palette className="mr-2 h-5 w-5" />
            Color Theme
          </h2>

          <div className="space-y-3">
            {themeOptions.map((theme) => {
              const Icon = theme.icon;
              return (
                <div
                  key={theme.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${appearanceSettings.theme === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  style={{
                    backgroundColor: appearanceSettings.theme === theme.id
                      ? 'var(--color-accent-bg)'
                      : 'var(--color-bg-primary)',
                    borderColor: appearanceSettings.theme === theme.id
                      ? 'var(--accent-color)'
                      : 'var(--color-border)',
                    transitionDuration: 'var(--animation-duration)'
                  }}
                  onClick={() => setAppearanceSettings(prev => ({
                    ...prev,
                    theme: theme.id
                  }))}
                  onMouseEnter={(e) => {
                    if (appearanceSettings.theme !== theme.id) {
                      e.target.style.borderColor = 'var(--color-text-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (appearanceSettings.theme !== theme.id) {
                      e.target.style.borderColor = 'var(--color-border)';
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-8 rounded ${theme.preview} border flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-medium"
                        style={{
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        {theme.name}
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-xs)'
                        }}
                      >
                        {theme.description}
                      </p>
                    </div>
                    {appearanceSettings.theme === theme.id && (
                      <Check
                        className="h-5 w-5"
                        style={{ color: 'var(--accent-color)' }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Background Options */}
        <div
          className="rounded-lg p-6 max-sm:p-2 transition-colors"
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
            <Image className="mr-2 h-5 w-5" />
            Background
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {backgroundOptions.map((bg) => (
              <div
                key={bg.id}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all`}
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: appearanceSettings.backgroundType === bg.id
                    ? 'var(--accent-color)'
                    : 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onClick={() => setAppearanceSettings(prev => ({
                  ...prev,
                  backgroundType: bg.id
                }))}
                onMouseEnter={(e) => {
                  if (appearanceSettings.backgroundType !== bg.id) {
                    e.target.style.borderColor = 'var(--color-text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (appearanceSettings.backgroundType !== bg.id) {
                    e.target.style.borderColor = 'var(--color-border)';
                  }
                }}
              >
                <div className={`w-full h-16 rounded ${bg.preview} border mb-2 flex items-center justify-center`}>
                  {bg.pattern && <div className="text-xs text-gray-500">Pattern</div>}
                  {bg.id === 'custom' && <Upload className="h-6 w-6 text-gray-400" />}
                </div>
                <h4
                  className="font-medium text-sm"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {bg.name}
                </h4>
                <p
                  className="text-xs"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)'
                  }}
                >
                  {bg.description}
                </p>
              </div>
            ))}
          </div>

          {appearanceSettings.backgroundType === 'custom' && (
            <div className="mt-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Upload Custom Background
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              />
            </div>
          )}
        </div>

        {/* Typography */}
        <div
          className="rounded-lg p-6 max-sm:p-2 transition-colors"
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
            <Type className="mr-2 h-5 w-5" />
            Typography
          </h2>

          <div
            className="space-y-6"
            style={{ gap: 'var(--component-padding)' }}
          >
            {/* Font Size */}
            <div
              className="mb-6"
              style={{ marginBottom: 'var(--component-padding)' }}
            >
              <label
                className="block text-sm font-medium mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Font Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setAppearanceSettings(prev => ({
                      ...prev,
                      fontSize: size.id
                    }))}
                    className={`p-3 border rounded-lg text-left transition-colors`}
                    style={{
                      backgroundColor: appearanceSettings.fontSize === size.id
                        ? 'var(--color-accent-bg)'
                        : 'var(--color-bg-primary)',
                      borderColor: appearanceSettings.fontSize === size.id
                        ? 'var(--accent-color)'
                        : 'var(--color-border)',
                      color: appearanceSettings.fontSize === size.id
                        ? 'var(--accent-color)'
                        : 'var(--color-text-primary)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (appearanceSettings.fontSize !== size.id) {
                        e.target.style.borderColor = 'var(--color-text-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (appearanceSettings.fontSize !== size.id) {
                        e.target.style.borderColor = 'var(--color-border)';
                      }
                    }}
                  >
                    <div className={`font-medium ${size.sample}`}>{size.name}</div>
                    <div
                      className="text-xs"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      {size.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Font Family
              </label>
              <div className="space-y-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setAppearanceSettings(prev => ({
                      ...prev,
                      fontFamily: font.id
                    }))}
                    className={`w-full p-3 border rounded-lg text-left transition-colors`}
                    style={{
                      backgroundColor: appearanceSettings.fontFamily === font.id
                        ? 'var(--color-accent-bg)'
                        : 'var(--color-bg-primary)',
                      borderColor: appearanceSettings.fontFamily === font.id
                        ? 'var(--accent-color)'
                        : 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (appearanceSettings.fontFamily !== font.id) {
                        e.target.style.borderColor = 'var(--color-text-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (appearanceSettings.fontFamily !== font.id) {
                        e.target.style.borderColor = 'var(--color-border)';
                      }
                    }}
                  >
                    <div
                      className={`font-medium ${font.class}`}
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {font.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      {font.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Layout & Spacing */}
        <div
          className="rounded-lg p-6 max-sm:p-2 transition-colors"
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
            <Layout className="mr-2 h-5 w-5" />
            Layout & Spacing
          </h2>

          <div className="space-y-6">
            {/* Layout Density */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Layout Density
              </label>
              <div className="space-y-2">
                {layoutOptions.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setAppearanceSettings(prev => ({
                      ...prev,
                      layoutDensity: layout.id
                    }))}
                    className={`w-full p-3 border rounded-lg text-left transition-colors`}
                    style={{
                      backgroundColor: appearanceSettings.layoutDensity === layout.id
                        ? 'var(--color-accent-bg)'
                        : 'var(--color-bg-primary)',
                      borderColor: appearanceSettings.layoutDensity === layout.id
                        ? 'var(--accent-color)'
                        : 'var(--color-border)',
                      transitionDuration: 'var(--animation-duration)'
                    }}
                    onMouseEnter={(e) => {
                      if (appearanceSettings.layoutDensity !== layout.id) {
                        e.target.style.borderColor = 'var(--color-text-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (appearanceSettings.layoutDensity !== layout.id) {
                        e.target.style.borderColor = 'var(--color-border)';
                      }
                    }}
                  >
                    <div
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {layout.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-xs)'
                      }}
                    >
                      {layout.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Style */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Sidebar Style
              </label>
              <div className="space-y-2">
                {sidebarOptions.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setAppearanceSettings(prev => ({
                        ...prev,
                        sidebarStyle: style.id
                      }))}
                      className={`w-full p-3 border rounded-lg text-left transition-colors flex items-center space-x-3`}
                      style={{
                        backgroundColor: appearanceSettings.sidebarStyle === style.id
                          ? 'var(--color-accent-bg)'
                          : 'var(--color-bg-primary)',
                        borderColor: appearanceSettings.sidebarStyle === style.id
                          ? 'var(--accent-color)'
                          : 'var(--color-border)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      onMouseEnter={(e) => {
                        if (appearanceSettings.sidebarStyle !== style.id) {
                          e.target.style.borderColor = 'var(--color-text-secondary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (appearanceSettings.sidebarStyle !== style.id) {
                          e.target.style.borderColor = 'var(--color-border)';
                        }
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {style.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          {style.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Accent Colors */}
        <div
          className="rounded-lg p-6 max-sm:p-2 transition-colors"
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
            <Settings className="mr-2 h-5 w-5" />
            Accent Color
          </h2>

          <div className="grid grid-cols-4 max-sm:grid-cols-3 py-3 gap-3 max-sm:gap-2">
            {accentColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setAppearanceSettings(prev => ({
                  ...prev,
                  accentColor: color.id
                }))}
                className={`p-2 max-sm:p-1 border-2 rounded-lg transition-all text-center`}
                style={{
                  borderColor: appearanceSettings.accentColor === color.id
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-border)',
                  boxShadow: appearanceSettings.accentColor === color.id
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    : 'none',
                  transitionDuration: 'var(--animation-duration)'
                }}
                onMouseEnter={(e) => {
                  if (appearanceSettings.accentColor !== color.id) {
                    e.target.style.borderColor = 'var(--color-text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (appearanceSettings.accentColor !== color.id) {
                    e.target.style.borderColor = 'var(--color-border)';
                  }
                }}
              >
                <div className={`w-full h-8 rounded ${color.color} mb-2`}></div>
                <div
                  className="text-xs font-medium"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-xs)'
                  }}
                >
                  {color.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Animation */}
        <div
          className="rounded-lg p-6 max-md:p-2 transition-colors"
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
            <Zap className="mr-2 h-5 w-5" />
            Animation & Accessibility
          </h2>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 max-sm:p-2 border rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <div>
                <h3
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Animations
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Enable smooth transitions and effects
                </p>
              </div>
              <button
                onClick={() => setAppearanceSettings(prev => ({
                  ...prev,
                  animationsEnabled: !prev.animationsEnabled
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                style={{
                  backgroundColor: appearanceSettings.animationsEnabled ? 'var(--accent-color)' : 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appearanceSettings.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  style={{ transitionDuration: 'var(--animation-duration)' }}
                />
              </button>
            </div>

            <div
              className="flex items-center justify-between p-4 max-sm:p-2 border rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <div>
                <h3
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  High Contrast
                </h3>
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
              <button
                onClick={() => setAppearanceSettings(prev => ({
                  ...prev,
                  highContrast: !prev.highContrast
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                style={{
                  backgroundColor: appearanceSettings.highContrast ? 'var(--accent-color)' : 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appearanceSettings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  style={{ transitionDuration: 'var(--animation-duration)' }}
                />
              </button>
            </div>

            <div
              className="flex items-center justify-between p-4 max-sm:p-2 border rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <div>
                <h3
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Reduced Motion
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  Minimize motion for accessibility
                </p>
              </div>
              <button
                onClick={() => setAppearanceSettings(prev => ({
                  ...prev,
                  reducedMotion: !prev.reducedMotion
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                style={{
                  backgroundColor: appearanceSettings.reducedMotion ? 'var(--accent-color)' : 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appearanceSettings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  style={{ transitionDuration: 'var(--animation-duration)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Settings Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleApplySettings}
          className="px-8 py-3 text-white rounded-lg font-medium transition-all"
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
          Apply All Settings
        </button>
      </div>
    </div>
  )
}

export default Appearance;
