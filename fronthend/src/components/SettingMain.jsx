import React from 'react';
import AccountSettings from '../pages/AccountSettings';
import PrivacyAndSecurity from '../pages/PrivacyAndSecurity';
import NotificationSettings from '../pages/NotificationSettings';
import Appearance from '../pages/Appearance';
import Accessibility from '../pages/Accessibility';
import HelpAndSupport from '../pages/HelpAndSupport';
import { useSelector } from 'react-redux';

const SettingMain = ({appearance}) => {

  const { settingsActive } = useSelector((state) => state.user);

  return (
    <div>
      {(settingsActive === 'Accounts' ? <AccountSettings /> : '') ||
        (settingsActive === 'Privacy & Security' ? <PrivacyAndSecurity /> : '') ||
        (settingsActive === 'Notification Settings' ? <NotificationSettings /> : '') ||
        (settingsActive === 'Appearance' ? <Appearance appearance={appearance} /> : '') ||
        (settingsActive === 'Accessibility' ? <Accessibility /> : '') ||
        (settingsActive === 'Help & Support' ? <HelpAndSupport /> : '')}
    </div>
  )
}

export default SettingMain;
