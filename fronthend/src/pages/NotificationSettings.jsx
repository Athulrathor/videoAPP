
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


const NotificationSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    // recommendations: true,
    comments: true,
    subscriptions: true,
    likes: false,
    // followers: true,
    // bookmarks: false,
    trending: true,
    newsletter: true,
    // security: true,
    // promotions: false
  });

  // const [pushSettings, setPushSettings] = useState({
  //   comments: true,
  //   likes: true,
  //   followers: true,
  //   subscriptions: false,
  //   recommendations: false
  // });

  const [globalSettings, setGlobalSettings] = useState({
    emailEnabled: true,
 // instant, daily, weekly
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
    // {
    //   id: 'recommendations',
    //   title: 'Recommendation Emails',
    //   description: 'Get personalized content based on your interests',
    //   icon: TrendingUp,
    //   hasFrequency: true
    // },
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
    // {
    //   id: 'followers',
    //   title: 'New Followers',
    //   description: 'When someone starts following you',
    //   icon: UserPlus,
    //   hasFrequency: false
    // },
    // {
    //   id: 'bookmarks',
    //   title: 'Bookmark Reminders',
    //   description: 'Reminders about your saved content',
    //   icon: Bookmark,
    //   hasFrequency: false
    // },
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
    // {
    //   id: 'security',
    //   title: 'Security Alerts',
    //   description: 'security updates and login notifications',
    //   icon: Settings,
    //   hasFrequency: false
    // },
    // {
    //   id: 'promotions',
    //   title: 'Promotions',
    //   description: 'offers, discounts, and promotional content',
    //   icon: TrendingUp,
    //   hasFrequency: false
    // }
  ];

  return (
    <div className="max-sm:w-full px-2 max-sm:p-0 sm:px-4 py-2 sm:py-4 bg-white overflow-y-scroll scrollBar max-md:h-[calc(100vh-53px)] h-[calc(100vh-65px)]">

      {/* Header */}
      <div className="mb-6 max-sm:p-2">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 leading-tight">
          Notification Settings
        </h1>
        <p className="text-gray-600 text-xs sm:text-base max-w-full truncate">
          Manage how and when you receive notifications
        </p>
      </div>

      {/* Global Controls */}
      <div className="bg-gray-50 rounded-lg p-0 max-sm:py-2 max-sm:p-2 sm:p-6 mb-6">
        <h2 className="flex items-center font-semibold mb-4 text-base sm:text-lg">
          <Settings className="mr-2 h-5 w-5 flex-shrink-0" />
          Global Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Email Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-white border border-gray-200 rounded-lg">
            <div className="mb-3 sm:mb-0 sm:flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">Email Notifications</h3>
              <p className="text-sm text-gray-600 truncate">Master control for all email notifications</p>
            </div>
            <button
              onClick={() => handleGlobalToggle('emailEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${globalSettings.emailEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              aria-label="Toggle Email Notifications"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${globalSettings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          {/* Master Push Toggle */}
          <div className="hidden flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-white border border-gray-200 rounded-lg">
            <div className="mb-3 sm:mb-0 sm:flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">Push Notifications</h3>
              <p className="text-sm text-gray-600 truncate">Master control for push notifications</p>
            </div>
            <button
              onClick={() => handleGlobalToggle('pushEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${globalSettings.pushEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              aria-label="Toggle Push Notifications"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${globalSettings.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={stopAllEmails}
            className="flex items-center px-3 py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm whitespace-nowrap"
            aria-label="Stop All Emails"
          >
            <VolumeX className="mr-2 h-4 w-4 flex-shrink-0" />
            Stop All Emails
          </button>
          <button
            onClick={enableAllEmails}
            className="flex items-center px-3 py-1 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-xs sm:text-sm whitespace-nowrap"
            aria-label="Enable All Emails"
          >
            <Volume2 className="mr-2 h-4 w-4 flex-shrink-0" />
            Enable All Emails
          </button>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-gray-50 rounded-lg max-sm:p-2 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 flex-shrink-0" />
          Quiet Hours
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">Enable Quiet Hours</h3>
            <p className="text-sm text-gray-600 truncate">Pause notifications during specified hours</p>
          </div>
          <button
            onClick={handleQuietHoursToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${globalSettings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            aria-label="Toggle Quiet Hours"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${globalSettings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {globalSettings.quietHours.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 truncate">Start Time</label>
              <input
                type="time"
                value={globalSettings.quietHours.start}
                onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 truncate">End Time</label>
              <input
                type="time"
                value={globalSettings.quietHours.end}
                onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Email Notification Categories */}
      <div className={`${!globalSettings.emailEnabled ? "hidden" : ""} bg-gray-50 rounded-lg max-sm:p-2 sm:p-6 mb-8`}>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
          Email Notifications
        </h2>

        <div className="space-y-4">
          {emailCategories.map((category) => {
            const Icon = category.icon;
            const isEnabled = emailSettings[category.id] && globalSettings.emailEnabled;

            return (
              <div key={category.id} className="p-2 sm:p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 max-sm:space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 truncate max-sm:text-sm">{category.title}</h3>
                      <p className="text-sm text-gray-600 truncate max-sm:text-xs">{category.description}</p>
                    </div>
                  </div>

                  <div className=" items-center space-x-2 sm:space-x-4 flex-shrink-0 min-w-max">
                    {/* { isEnabled && (
                      <select
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Frequency for ${category.title}`}
                      >
                        {frequencyOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )} */}

                    <button
                      onClick={() => handleEmailToggle(category.id)}
                      // disabled={!globalSettings.emailEnabled}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        } /`}
                      aria-label={`Toggle email notifications for ${category.title}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Push Notification Categories */}
      <div className="bg-gray-50 hidden rounded-lg max-sm:p-2 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Bell className="mr-2 h-5 w-5 flex-shrink-0" />
          Push Notifications
        </h2>

        <div className="hidden grid-cols-1 md:grid-cols-2 gap-4">
          {/* {pushCategories.map((category) => {
            const Icon = category.icon;
            const isEnabled = pushSettings[category.id] && globalSettings.pushEnabled;

            return (
              <div key={category.id} className="hidden flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 bg-white border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 max-sm:space-x-1 flex-1 min-w-0">
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900 truncate">{category.title}</span>
                </div>
                <button
                  // onClick={() => handlePushToggle(category.id)}
                  disabled={!globalSettings.pushEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    } ${!globalSettings.pushEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={`Toggle push notifications for ${category.title}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            );
          })} */}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-gray-50 rounded-lg max-sm:p-2 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3  sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center max-w-full">
            <Filter className="mr-2 h-5 w-5 flex-shrink-0" />
            Recent Notifications
          </h2>
          <button className="flex items-center px-2 sm:px-4 py-1 sm:py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm whitespace-nowrap">
            <Edit className="mr-2 h-4 w-4" />
            Manage All
          </button>
        </div>

        <div className="hidden space-y-3 w-full">
          {/* {recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 max-sm:p-2 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-gray-300' : 'bg-blue-600'
                    }`}
                />
                <div className="overflow-hidden">
                  <h4 className="font-medium text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap">{notification.title}</h4>
                  <p className="text-sm text-gray-600 truncate">{notification.time}</p>
                </div>
              </div>
              <button
                className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                aria-label={`Delete notification ${notification.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))} */}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <h3 className="font-medium mb-2 max-sm:sm">Email Management</h3>
          <p className="mb-3 max-sm:xs">
            You can also manage your email preferences by clicking the unsubscribe link in any email we send you.
          </p>
          <button className="max-sm:xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
            View Email Subscription Center →
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
