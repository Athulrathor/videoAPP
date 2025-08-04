
import React, { useState } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Trash2,
  Pause,
  Play,
  MapPin,
  Clock,
  Settings,
  AlertTriangle,
  Check,
  X,
  MoreVertical
} from 'lucide-react';

const PrivacyAndSecurity = () => {
  // const [currentSection, setCurrentSection] = useState('password');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [watchHistoryPaused, setWatchHistoryPaused] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock data for active devices
  const [activeDevices] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
      browser: 'Safari'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
      browser: 'Chrome'
    },
    {
      id: 3,
      name: 'Windows PC',
      location: 'Los Angeles, CA',
      lastActive: '3 days ago',
      current: false,
      browser: 'Edge'
    }
  ]);

  // Mock data for watch history
  const [watchHistory] = useState([
    {
      id: 1,
      title: 'Introduction to React Hooks',
      duration: '45:30',
      watchedAt: '2024-08-01 14:30',
      progress: 100
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      duration: '1:20:15',
      watchedAt: '2024-08-01 10:15',
      progress: 75
    },
    {
      id: 3,
      title: 'CSS Grid Layout Tutorial',
      duration: '32:45',
      watchedAt: '2024-07-31 16:45',
      progress: 45
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      duration: '2:15:30',
      watchedAt: '2024-07-30 20:00',
      progress: 30
    }
  ]);

  const handlePasswordToggle = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Changing password...', passwordData);
    // Add password change logic here
  };

  const handleDeviceLogout = (deviceId) => {
    console.log('Logging out device:', deviceId);
    // Add device logout logic here
  };

  const handleDeleteWatchHistory = (itemId) => {
    console.log('Deleting watch history item:', itemId);
    // Add delete logic here
  };

  const handleClearAllHistory = () => {
    console.log('Clearing all watch history...');
    // Add clear all logic here
  };

  // const sections = [
  //   { id: 'password', name: 'Password', icon: Key },
  //   { id: 'twoFactor', name: 'Two-Factor Auth', icon: Shield },
  //   { id: 'devices', name: 'Active Devices', icon: Monitor },
  //   { id: 'history', name: 'Watch History', icon: Clock }
  // ];

  return (
    <div className="w-full max-w-4xl mx-auto pl-4 pt-3 scrollBar max-md:p-0 bg-white overflow-y-auto h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:max-w-2xl max-md:max-w-full max-md:w-full sm:px-3 sm:pt-2 max-[400px]:pl-2">
      {/* Header */}
      <div className="mb-8 max-md:pt-4 max-md:pl-4 max-md:mb-4 max-sm:mb-2 max-[400px]:pl-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 max-md:text-[18px] max-sm:text-lg max-[400px]:text-base">
          Privacy & Security
        </h1>
        <p className="text-gray-600 max-md:text-sm max-[400px]:text-xs">
          Manage your account security and privacy settings
        </p>
      </div>

      <div className="flex lg:flex-row flex-col gap-8 max-lg:gap-4 max-md:gap-2">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Password Change Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2 max-[400px]:px-1.5">
            <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
              <Key className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
              Change Password
            </h2>
            <div className="space-y-6 max-sm:space-y-3">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 max-[400px]:text-xs">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-[400px]:px-2 max-[400px]:py-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordToggle('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 max-[400px]:text-xs">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-[400px]:px-2 max-[400px]:py-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordToggle('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 max-[400px]:text-xs">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-[400px]:px-2 max-[400px]:py-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordToggle('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="button"
                onClick={handlePasswordSubmit}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base max-[400px]:px-4 max-[400px]:py-1 max-sm:text-xs"
              >
                Update Password
              </button>
            </div>
          </div>
          {/* 2FA Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2 max-[400px]:px-1.5">
            <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
              Two-Factor Authentication
            </h2>
            <div className="space-y-6 max-sm:space-y-3">
              {/* SMS Auth Row */}
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <div>
                  <h3 className="font-medium text-gray-900 text-base max-[400px]:text-xs">SMS Authentication</h3>
                  <p className="text-sm text-gray-600 max-[400px]:text-xs">Receive codes via text message</p>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors text-xs ${twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
              {/* ...other 2FA sections... */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                <h3 className="font-medium text-gray-900 mb-2 text-base max-[400px]:text-xs">Authenticator App</h3>
                <p className="text-sm text-gray-600 mb-3 max-[400px]:text-xs">Use an authenticator app for more secure 2FA</p>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-base max-[400px]:px-2 max-[400px]:py-1 max-[400px]:text-xs">
                  Set Up Authenticator
                </button>
              </div>
            </div>
          </div>
          {/* Active Devices */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 max-md:rounded-none max-sm:px-3 max-sm:py-3 max-sm:mb-2">
            <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 mb-6 flex items-center">
              <Monitor className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
              Active Devices
            </h2>
            <div className="space-y-4 max-sm:space-y-2">
              {activeDevices.map((device) => (
                <div key={device.id} className="p-4 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                  <div className="flex items-center justify-between">
                                       <div className="flex items-center space-x-3 max-sm:space-x-1">
                                         <div className="p-2 bg-gray-100 rounded-lg">
                                           {device.name.includes('iPhone') ? (
                                            <Smartphone className="h-5 w-5 max-sm:w-4 text-gray-600" />
                                          ) : (
                                            <Monitor className="h-5 w-5 max-sm:w-4 text-gray-600" />
                                          )}
                                        </div>
                                        <div>
                                          <div className="flex items-center space-x-2 xa-msm:space-x-1">
                                            <h3 className="font-medium max-sm:text-sm text-gray-900">{device.name}</h3>
                                            {device.current && (
                                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                Current
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center text-sm max-sm:text-[10px] text-gray-600 space-x-4 max-sm:space-x-1.5">
                                            <span className="flex items-center">
                                              <MapPin className="h-3 w-3 mr-1 max-sm:w-2" />
                                              {device.location}
                                            </span>
                                            <span>Last active: {device.lastActive}</span>
                                            <span >{device.browser}</span>
                                          </div>
                                        </div>
                                      </div>
                                      {!device.current && (
                                        <button
                                          onClick={() => handleDeviceLogout(device.id)}
                                          className="px-3 py-1 max-sm:px-1.5 max-sm:py-0.5 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors max-sm:text-xs"
                                        >
                                          Sign Out
                                        </button>
                                      )}
                                    </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 max-sm:h-4 max-[400px]:h-3" />
                <div>
                  <h3 className="font-medium text-amber-800 text-base max-[400px]:text-xs">Security Tip</h3>
                  <p className="text-amber-700 text-sm mt-1 max-[400px]:text-xs">
                    If you see any unfamiliar devices, sign them out immediately and change your password.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Watch History */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 max-sm:px-3 max-sm:py-3 max-sm:mb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 max-sm:mb-3">
              <h2 className="text-xl max-sm:text-base max-[400px]:text-sm font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-5 w-5 max-sm:w-4 max-[400px]:h-3 max-[400px]:w-3" />
                Watch History
              </h2>
              <div className="flex items-center space-x-3 max-sm:space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setWatchHistoryPaused(!watchHistoryPaused)}
                  className={`flex items-center max-sm:text-xs px-4 py-2 max-sm:px-2 max-sm:py-1 rounded-lg transition-colors ${watchHistoryPaused
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                >
                  {watchHistoryPaused ? (
                    <>
                      <Play className="mr-2 max-sm:mr-1 h-4 w-4 max-sm:w-3 stroke-2" />
                      Resume Tracking
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 max-sm:mr-1 w-4 max-sm:w-3 stroke-2" />
                      Pause Tracking
                    </>
                  )}
                </button>
                <button
                  onClick={handleClearAllHistory}
                  className="flex items-center px-4 py-2 max-sm:text-xs max-sm:px-2 max-sm:py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="mr-2 h-4 w-4 max-sm:mr-1 max-sm:w-3 stroke-2" />
                  Clear All
                </button>
              </div>
            </div>
            <div className="space-y-4 max-sm:space-y-2">
              {watchHistory.map((item) => (
                <div key={item.id} className="p-4 max-sm:p-1 bg-white border border-gray-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
                  <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                     <h3 className="font-medium text-gray-900 max-sm:text-sm">{item.title}</h3>
                                    <div className="flex items-center text-sm max-sm:text-xs text-gray-600 space-x-4 max-sm:space-x-2 mt-1">
                                      <span>Duration: {item.duration}</span>
                                       <span>Watched: {item.watchedAt}</span>
                                       <span>Progress: {item.progress}%</span>
                                     </div>
                                     <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${item.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteWatchHistory(item.id)}
                                    className="ml-4 max-sm:ml-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-sm:p-2 max-[400px]:p-1.5">
              <h3 className="font-medium text-blue-800 mb-2 text-base max-[400px]:text-xs">Privacy Controls</h3>
              <p className="text-blue-700 text-sm mb-3 max-[400px]:text-xs">
                Control how your watch history is used for recommendations and personalization.
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-blue-800 max-[400px]:text-xs">Use watch history for recommendations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-blue-800 max-[400px]:text-xs">Include in search suggestions</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div className="w-4xl pl-4 pt-3 scrollBar  max-md:p-0 bg-white overflow-y-auto h-[calc(100vh-65px)] max-md:h-[calc(100vh-53px)] max-xl:w-2xl max-md:w-screen max-[1040px]:w-2xl">
    //     {/* Header */}
    //     <div className="mb-8 max-md:pt-4 max-md:pl-4 max-md:mb-4">
    //       <h1 className="text-3xl font-bold text-gray-900 mb-2 max-md:text-[18px]">Privacy & Security</h1>
    //       <p className="text-gray-600 max-md:text-sm">Manage your account security and privacy settings</p>
    //     </div>

    //     <div className="flex lg:flex-row gap-8">

    //       {/* Main Content */}
    //       <div className="flex-1">
    //         {/* Password Change Section */}
    //           <div className="bg-gray-50 rounded-lg p-6 mb-4">
    //           <h2 className="text-xl max-sm:text-sm font-semibold text-gray-900 mb-6 flex items-center">
    //               <Key className="mr-2 h-5 w-5 max-sm:w-4" />
    //               Change Password
    //             </h2>

    //             <div className="space-y-6">
    //               <div>
    //                 <label className="block text-sm font-medium text-gray-700 mb-2">
    //                   Current Password
    //                 </label>
    //                 <div className="relative">
    //                   <input
    //                     type={showPassword.current ? 'text' : 'password'}
    //                     name="currentPassword"
    //                     value={passwordData.currentPassword}
    //                     onChange={handlePasswordChange}
    //                     className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     required
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() => handlePasswordToggle('current')}
    //                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
    //                   >
    //                     {showPassword.current ? (
    //                       <EyeOff className="h-4 w-4 text-gray-400" />
    //                     ) : (
    //                       <Eye className="h-4 w-4 text-gray-400" />
    //                     )}
    //                   </button>
    //                 </div>
    //               </div>

    //               <div>
    //                 <label className="block text-sm font-medium text-gray-700 mb-2">
    //                   New Password
    //                 </label>
    //                 <div className="relative">
    //                   <input
    //                     type={showPassword.new ? 'text' : 'password'}
    //                     name="newPassword"
    //                     value={passwordData.newPassword}
    //                     onChange={handlePasswordChange}
    //                     className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     required
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() => handlePasswordToggle('new')}
    //                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
    //                   >
    //                     {showPassword.new ? (
    //                       <EyeOff className="h-4 w-4 text-gray-400" />
    //                     ) : (
    //                       <Eye className="h-4 w-4 text-gray-400" />
    //                     )}
    //                   </button>
    //                 </div>
    //               </div>

    //               <div>
    //                 <label className="block text-sm font-medium text-gray-700 mb-2">
    //                   Confirm New Password
    //                 </label>
    //                 <div className="relative">
    //                   <input
    //                     type={showPassword.confirm ? 'text' : 'password'}
    //                     name="confirmPassword"
    //                     value={passwordData.confirmPassword}
    //                     onChange={handlePasswordChange}
    //                     className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     required
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() => handlePasswordToggle('confirm')}
    //                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
    //                   >
    //                     {showPassword.confirm ? (
    //                       <EyeOff className="h-4 w-4 text-gray-400" />
    //                     ) : (
    //                       <Eye className="h-4 w-4 text-gray-400" />
    //                     )}
    //                   </button>
    //                 </div>
    //               </div>

    //               <button
    //                 type="button"
    //                 onClick={handlePasswordSubmit}
    //                 className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    //               >
    //                 Update Password
    //               </button>
    //             </div>
    //           </div>

    //         {/* Two-Factor Authentication Section */}
    //           <div className="bg-gray-50 rounded-lg p-6 mb-4">
    //           <h2 className="text-xl max-sm:text-sm font-semibold text-gray-900 mb-6 flex items-center">
    //               <Shield className="mr-2 h-5 w-5 max-sm:w-4" />
    //               Two-Factor Authentication
    //             </h2>

    //             <div className="space-y-6">
    //               <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
    //                 <div>
    //                   <h3 className="font-medium text-gray-900">SMS Authentication</h3>
    //                   <p className="text-sm text-gray-600">Receive codes via text message</p>
    //                 </div>
    //                 <button
    //                   onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
    //                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
    //                     }`}
    //                 >
    //                   <span
    //                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
    //                       }`}
    //                   />
    //                 </button>
    //               </div>

    //               {twoFactorEnabled && (
    //                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
    //                   <div className="flex items-center">
    //                     <Check className="h-5 w-5 text-green-600 mr-2" />
    //                     <span className="text-green-800 font-medium">Two-factor authentication is enabled</span>
    //                   </div>
    //                   <p className="text-green-700 text-sm mt-1">Your account is protected with SMS verification</p>
    //                 </div>
    //               )}

    //               <div className="p-4 bg-white border border-gray-200 rounded-lg">
    //                 <h3 className="font-medium text-gray-900 mb-2">Authenticator App</h3>
    //                 <p className="text-sm text-gray-600 mb-3">Use an authenticator app for more secure 2FA</p>
    //                 <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
    //                   Set Up Authenticator
    //                 </button>
    //               </div>
    //             </div>
    //           </div>

    //         {/* Active Devices Section */}
    //           <div className="bg-gray-50 rounded-lg p-6 max-sm:p-1 mb-4 max-md:rounded-none">
    //             <h2 className="text-xl max-sm:text-sm font-semibold text-gray-900 mb-6 flex items-center">
    //             <Monitor className="mr-2 h-5 w-5 max-sm:w-4" />
    //               Active Devices
    //             </h2>

    //             <div className="space-y-4 max-sm:space-y-2">
    //               {activeDevices.map((device) => (
    //                 <div key={device.id} className="p-4 max-sm:p-2 bg-white border border-gray-200 rounded-lg">
    //                   <div className="flex items-center justify-between">
    //                     <div className="flex items-center space-x-3 max-sm:space-x-1">
    //                       <div className="p-2 bg-gray-100 rounded-lg">
    //                         {device.name.includes('iPhone') ? (
    //                           <Smartphone className="h-5 w-5 max-sm:w-4 text-gray-600" />
    //                         ) : (
    //                           <Monitor className="h-5 w-5 max-sm:w-4 text-gray-600" />
    //                         )}
    //                       </div>
    //                       <div>
    //                         <div className="flex items-center space-x-2 xa-msm:space-x-1">
    //                           <h3 className="font-medium max-sm:text-sm text-gray-900">{device.name}</h3>
    //                           {device.current && (
    //                             <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
    //                               Current
    //                             </span>
    //                           )}
    //                         </div>
    //                         <div className="flex items-center text-sm max-sm:text-[10px] text-gray-600 space-x-4 max-sm:space-x-1.5">
    //                           <span className="flex items-center">
    //                             <MapPin className="h-3 w-3 mr-1 max-sm:w-2" />
    //                             {device.location}
    //                           </span>
    //                           <span>Last active: {device.lastActive}</span>
    //                           <span >{device.browser}</span>
    //                         </div>
    //                       </div>
    //                     </div>
    //                     {!device.current && (
    //                       <button
    //                         onClick={() => handleDeviceLogout(device.id)}
    //                         className="px-3 py-1 max-sm:px-1.5 max-sm:py-0.5 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors max-sm:text-xs"
    //                       >
    //                         Sign Out
    //                       </button>
    //                     )}
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>

    //             <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    //               <div className="flex items-start">
    //                 <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
    //                 <div>
    //                   <h3 className="font-medium text-amber-800">Security Tip</h3>
    //                   <p className="text-amber-700 text-sm mt-1">
    //                     If you see any unfamiliar devices, sign them out immediately and change your password.
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //         {/* Watch History Section */}
    //           <div className="bg-gray-50 rounded-lg p-6 mb-4">
    //             <div className="flex items-center justify-between mb-6">
    //             <h2 className="text-xl max-sm:text-sm font-semibold text-gray-900 flex items-center">
    //                 <Clock className="mr-2 h-5 w-5 max-sm:w-4" />
    //                 Watch History
    //               </h2>
    //               <div className="flex items-center space-x-3 max-sm:space-x-2">
    //                 <button
    //                   onClick={() => setWatchHistoryPaused(!watchHistoryPaused)}
    //                   className={`flex items-center max-sm:text-xs px-4 py-2 max-sm:px-2 max-sm:py-1 rounded-lg transition-colors ${watchHistoryPaused
    //                       ? 'bg-green-600 text-white hover:bg-green-700'
    //                       : 'bg-amber-600 text-white hover:bg-amber-700'
    //                     }`}
    //                 >
    //                   {watchHistoryPaused ? (
    //                     <>
    //                       <Play className="mr-2 max-sm:mr-1 h-4 w-4 max;sm:w-3 stroke-2" />
    //                       Resume Tracking
    //                     </>
    //                   ) : (
    //                     <>
    //                       <Pause className="mr-2 h-4 max-sm:mr-1 w-4 max-sm:w-3 stroke-2" />
    //                       Pause Tracking
    //                     </>
    //                   )}
    //                 </button>
    //                 <button
    //                   onClick={handleClearAllHistory}
    //                 className="flex items-center px-4 py-2 max-sm:text-xs max-sm:px-2 max-sm:py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
    //                 >
    //                 <Trash2 className="mr-2 h-4 w-4 max-sm:mr-1 max-sm:w-3 stroke-2" />
    //                   Clear All
    //                 </button>
    //               </div>
    //             </div>

    //             {watchHistoryPaused && (
    //               <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    //                 <div className="flex items-center">
    //                   <Pause className="h-5 w-5 text-amber-600 mr-2" />
    //                   <span className="text-amber-800 font-medium">Watch history tracking is paused</span>
    //                 </div>
    //                 <p className="text-amber-700 text-sm mt-1">Your viewing activity is not being recorded</p>
    //               </div>
    //             )}

    //             <div className="space-y-4">
    //               {watchHistory.map((item) => (
    //                 <div key={item.id} className="p-4 max-sm:p-1 bg-white border border-gray-200 rounded-lg">
    //                   <div className="flex items-center justify-between">
    //                     <div className="flex-1">
    //                       <h3 className="font-medium text-gray-900 max-sm:text-sm">{item.title}</h3>
    //                       <div className="flex items-center text-sm max-sm:text-xs text-gray-600 space-x-4 max-sm:space-x-2 mt-1">
    //                         <span>Duration: {item.duration}</span>
    //                         <span>Watched: {item.watchedAt}</span>
    //                         <span>Progress: {item.progress}%</span>
    //                       </div>
    //                       <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
    //                         <div
    //                           className="bg-blue-600 h-2 rounded-full"
    //                           style={{ width: `${item.progress}%` }}
    //                         ></div>
    //                       </div>
    //                     </div>
    //                     <button
    //                       onClick={() => handleDeleteWatchHistory(item.id)}
    //                       className="ml-4 max-sm:ml-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
    //                     >
    //                       <X className="h-4 w-4" />
    //                     </button>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>

    //             <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    //               <h3 className="font-medium text-blue-800 mb-2">Privacy Controls</h3>
    //               <p className="text-blue-700 text-sm mb-3">
    //                 Control how your watch history is used for recommendations and personalization.
    //               </p>
    //               <div className="space-y-2">
    //                 <label className="flex items-center">
    //                   <input type="checkbox" className="mr-2" defaultChecked />
    //                   <span className="text-sm text-blue-800">Use watch history for recommendations</span>
    //                 </label>
    //                 <label className="flex items-center">
    //                   <input type="checkbox" className="mr-2" defaultChecked />
    //                   <span className="text-sm text-blue-800">Include in search suggestions</span>
    //                 </label>
    //               </div>
    //             </div>
    //           </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default PrivacyAndSecurity
