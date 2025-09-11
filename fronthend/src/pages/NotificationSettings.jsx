import React, { useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Heart,
  UserPlus,
  Bookmark,
  TrendingUp,
  Volume2,
  VolumeX,
  Settings,
  Clock,
  Filter,
  Edit
} from 'lucide-react';
// import { useAppearance } from '../hooks/appearances';

const NotificationSettings = () => {
  // const { appearanceSettings } = useAppearance();

  const [emailSettings, setEmailSettings] = useState({
    comments: true,
    subscriptions: true,
    likes: false,
    trending: true,
    newsletter: true,
  });

  const [globalSettings, setGlobalSettings] = useState({
    emailEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const handleEmailToggle = (setting) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleGlobalToggle = (setting) => {
    setGlobalSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleQuietHoursToggle = () => {
    setGlobalSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled
      }
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setGlobalSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const stopAllEmails = () => {
    const allOff = Object.keys(emailSettings).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setEmailSettings(allOff);
    setGlobalSettings(prev => ({ ...prev, emailEnabled: false }));
  };

  const enableAllEmails = () => {
    const allOn = Object.keys(emailSettings).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setEmailSettings(allOn);
    setGlobalSettings(prev => ({ ...prev, emailEnabled: true }));
  };

  const emailCategories = [
    {
      id: 'comments',
      title: 'Comment Notifications',
      description: 'comments or replies to your comments',
      icon: MessageSquare,
      hasFrequency: true
    },
    {
      id: 'subscriptions',
      title: 'Subscription Updates',
      description: 'New content from channels you follow',
      icon: UserPlus,
      hasFrequency: true
    },
    {
      id: 'likes',
      title: 'Likes & Reactions',
      description: 'When someone likes your content or comments',
      icon: Heart,
      hasFrequency: false
    },
    {
      id: 'trending',
      title: 'Trending Content',
      description: 'Popular and trending content of your interest',
      icon: TrendingUp,
      hasFrequency: false
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Platform updates, new features, and highlights',
      icon: Mail,
      hasFrequency: true
    },
  ];

  return (
    <div
      className="max-sm:w-full px-2 max-sm:p-0 sm:px-4 py-2 sm:py-4 overflow-y-scroll scrollBar max-md:h-[calc(100vh-41px)] h-[calc(100vh-57px)] transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {/* Header */}
      <div
        className="mb-6 max-sm:p-2"
        style={{ marginBottom: 'var(--section-gap)' }}
      >
        <h1
          className="text-xl sm:text-3xl font-bold mb-1 leading-tight"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-3xl)',
            fontFamily: 'var(--font-family)'
          }}
        >
          Notification Settings
        </h1>
        <p
          className="text-xs sm:text-base max-w-full truncate"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-base)'
          }}
        >
          Manage how and when you receive notifications
        </p>
      </div>

      {/* Global Controls */}
      <div
        className="rounded-lg p-0 max-sm:py-2 max-sm:p-2 sm:p-6 mb-6 transition-all"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          marginBottom: 'var(--section-gap)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <h2
          className="flex items-center font-semibold mb-4 text-base sm:text-lg"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-lg)',
            marginBottom: 'var(--component-padding)'
          }}
        >
          <Settings className="mr-2 h-5 w-5 flex-shrink-0" />
          Global Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Email Toggle */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <div className="mb-3 sm:mb-0 sm:flex-1 min-w-0">
              <h3
                className="font-medium truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Email Notifications
              </h3>
              <p
                className="text-sm truncate"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Master control for all email notifications
              </p>
            </div>
            <button
              onClick={() => handleGlobalToggle('emailEnabled')}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
              style={{
                backgroundColor: globalSettings.emailEnabled ? 'var(--accent-color)' : 'var(--color-border)',
                transitionDuration: 'var(--animation-duration)'
              }}
              aria-label="Toggle Email Notifications"
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{
                  transform: globalSettings.emailEnabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={stopAllEmails}
            className="flex items-center px-3 py-1 border rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap"
            style={{
              color: 'var(--color-error)',
              borderColor: 'var(--color-error)',
              backgroundColor: 'transparent',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label="Stop All Emails"
          >
            <VolumeX className="mr-2 h-4 w-4 flex-shrink-0" />
            Stop All Emails
          </button>
          <button
            onClick={enableAllEmails}
            className="flex items-center px-3 py-1 border rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap"
            style={{
              color: 'var(--color-success)',
              borderColor: 'var(--color-success)',
              backgroundColor: 'transparent',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label="Enable All Emails"
          >
            <Volume2 className="mr-2 h-4 w-4 flex-shrink-0" />
            Enable All Emails
          </button>
        </div>
      </div>

      {/* Quiet Hours */}
      <div
        className="rounded-lg max-sm:p-2 sm:p-6 mb-8 transition-all"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          marginBottom: 'var(--section-gap)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <h2
          className="text-lg sm:text-xl font-semibold mb-4 flex items-center"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--component-padding)'
          }}
        >
          <Clock className="mr-2 h-5 w-5 flex-shrink-0" />
          Quiet Hours
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="min-w-0">
            <h3
              className="font-medium truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Enable Quiet Hours
            </h3>
            <p
              className="text-sm truncate"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              Pause notifications during specified hours
            </p>
          </div>
          <button
            onClick={handleQuietHoursToggle}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
            style={{
              backgroundColor: globalSettings.quietHours.enabled ? 'var(--accent-color)' : 'var(--color-border)',
              transitionDuration: 'var(--animation-duration)'
            }}
            aria-label="Toggle Quiet Hours"
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{
                transform: globalSettings.quietHours.enabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                transitionDuration: 'var(--animation-duration)'
              }}
            />
          </button>
        </div>

        {globalSettings.quietHours.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2 truncate"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Start Time
              </label>
              <input
                type="time"
                value={globalSettings.quietHours.start}
                onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                className="w-full min-w-0 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
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
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2 truncate"
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                End Time
              </label>
              <input
                type="time"
                value={globalSettings.quietHours.end}
                onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                className="w-full min-w-0 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
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
              />
            </div>
          </div>
        )}
      </div>

      {/* Email Notification Categories */}
      <div
        className={`${!globalSettings.emailEnabled ? "hidden" : ""} rounded-lg max-sm:p-2 sm:p-6 mb-8 transition-all`}
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          marginBottom: 'var(--section-gap)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <h2
          className="text-lg sm:text-xl font-semibold mb-6 flex items-center"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--component-padding)'
          }}
        >
          <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
          Email Notifications
        </h2>

        <div className="space-y-4">
          {emailCategories.map((category) => {
            const Icon = category.icon;
            const isEnabled = emailSettings[category.id] && globalSettings.emailEnabled;

            return (
              <div
                key={category.id}
                className="p-2 sm:p-4 border rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)',
                  transitionDuration: 'var(--animation-duration)'
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 max-sm:space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-medium truncate max-sm:text-sm"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {category.title}
                      </h3>
                      <p
                        className="text-sm truncate max-sm:text-xs"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-sm)'
                        }}
                      >
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="items-center space-x-2 sm:space-x-4 flex-shrink-0 min-w-max">
                    <button
                      onClick={() => handleEmailToggle(category.id)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      style={{
                        backgroundColor: isEnabled ? 'var(--accent-color)' : 'var(--color-border)',
                        transitionDuration: 'var(--animation-duration)'
                      }}
                      aria-label={`Toggle email notifications for ${category.title}`}
                    >
                      <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        style={{
                          transform: isEnabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                          transitionDuration: 'var(--animation-duration)'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Notifications */}
      <div
        className="rounded-lg max-sm:p-2 sm:p-6 transition-all"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          padding: 'var(--component-padding)',
          transitionDuration: 'var(--animation-duration)'
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
          <h2
            className="text-lg sm:text-xl font-semibold flex items-center max-w-full"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-xl)'
            }}
          >
            <Filter className="mr-2 h-5 w-5 flex-shrink-0" />
            Recent Notifications
          </h2>
          <button
            className="flex items-center px-2 sm:px-4 py-1 sm:py-2 border rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap"
            style={{
              color: 'var(--accent-color)',
              borderColor: 'var(--accent-color)',
              backgroundColor: 'transparent',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-bg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Manage All
          </button>
        </div>

        <div
          className="mt-6 p-4 border rounded-lg text-sm transition-all"
          style={{
            backgroundColor: 'var(--color-accent-bg)',
            borderColor: 'var(--accent-color)',
            color: 'var(--accent-color)',
            fontSize: 'var(--font-size-sm)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <h3
            className="font-medium mb-2 max-sm:sm"
            style={{ color: 'var(--accent-color)' }}
          >
            Email Management
          </h3>
          <p
            className="mb-3 max-sm:xs"
            style={{
              color: 'var(--accent-color)',
              opacity: '0.8'
            }}
          >
            You can also manage your email preferences by clicking the unsubscribe link in any email we send you.
          </p>
          <button
            className="max-sm:xs font-medium whitespace-nowrap transition-colors"
            style={{
              color: 'var(--accent-color)',
              transitionDuration: 'var(--animation-duration)'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            View Email Subscription Center →
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings;
