import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsActive } from '../redux/features/user';
import { BadgeInfo, BellDot, Cookie, EarthLock, Keyboard, PersonStanding, UserPen } from 'lucide-react';
import { useAppearance } from '../hooks/appearances';

const SettingSideBar = (props) => {
  const { showMenu } = props;
  const { settingsActive } = useSelector((state) => state.user);
  const { appearanceSettings } = useAppearance();

  const dispatch = useDispatch();

  const handleSettingsClick = (e) => {
    const { name } = e.target;
    dispatch(setSettingsActive(name));
  }

  return (
    <div
      className={`${showMenu ? 'translate-x-0' : '-translate-x-full absolute'
        } z-15 scroll h-[calc(100vh-57px)] w-[272px] max-md:absolute overflow-y-scroll transition-all duration-1000 ease-in-out scroll-smooth max-md:text-lg text-lg py-3 max-md:py-1.5 px-2 max-md:px-0 space-y-2 max-md:space-y-1 flex flex-col shadow-md max-md:h-[calc(100vh-41px)]`}
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--font-size-lg)',
        transitionDuration: 'var(--animation-duration)',
        borderRight: '1px solid var(--color-border)'
      }}
    >
      <button
        name='Accounts'
        onClick={(e) => handleSettingsClick(e)}
        className="max-md:mr-2 py-1.5 rounded-lg max-md:py-1 pr-2 px-2.5 max-md:px-2 max-md:ml-2 flex items-center justify-baseline transition-all"
        style={{
          backgroundColor: settingsActive === 'Accounts'
            ? 'var(--color-accent-bg)'
            : 'transparent',
          color: settingsActive === 'Accounts'
            ? 'var(--accent-color)'
            : 'var(--color-text-primary)',
          border: settingsActive === 'Accounts'
            ? '1px solid var(--accent-color)'
            : '1px solid transparent',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (settingsActive !== 'Accounts') {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (settingsActive !== 'Accounts') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <UserPen className='max-md:mr-2 mr-3 max-md:w-4 w-6' />
        Accounts
      </button>

      <button
        name='Privacy & Security'
        onClick={(e) => handleSettingsClick(e)}
        className="max-md:mr-2 rounded-lg py-1.5 max-md:py-1 pr-2 px-2.5 max-md:px-2 max-md:ml-2 flex items-center justify-baseline transition-all"
        style={{
          backgroundColor: settingsActive === 'Privacy & Security'
            ? 'var(--color-accent-bg)'
            : 'transparent',
          color: settingsActive === 'Privacy & Security'
            ? 'var(--accent-color)'
            : 'var(--color-text-primary)',
          border: settingsActive === 'Privacy & Security'
            ? '1px solid var(--accent-color)'
            : '1px solid transparent',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (settingsActive !== 'Privacy & Security') {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (settingsActive !== 'Privacy & Security') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <EarthLock className='max-md:mr-2 mr-3 max-md:w-4 w-5' />
        Privacy & Security
      </button>

      <button
        name='Notification Settings'
        onClick={(e) => handleSettingsClick(e)}
        className="max-md:mr-2 rounded-lg py-1.5 max-md:py-1 pr-2 px-2.5 max-lg:p-1 max-md:px-2 max-md:ml-2 flex items-center justify-baseline transition-all"
        style={{
          backgroundColor: settingsActive === 'Notification Settings'
            ? 'var(--color-accent-bg)'
            : 'transparent',
          color: settingsActive === 'Notification Settings'
            ? 'var(--accent-color)'
            : 'var(--color-text-primary)',
          border: settingsActive === 'Notification Settings'
            ? '1px solid var(--accent-color)'
            : '1px solid transparent',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (settingsActive !== 'Notification Settings') {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (settingsActive !== 'Notification Settings') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <BellDot className='max-md:mr-2 mr-3 max-md:w-4 w-5' />
        Notification
      </button>

      <button
        name='Appearance'
        onClick={(e) => handleSettingsClick(e)}
        className="max-md:mr-2 rounded-lg py-1.5 max-md:py-1 pr-2 px-2.5 max-md:px-2 max-md:ml-2 flex items-center justify-baseline transition-all"
        style={{
          backgroundColor: settingsActive === 'Appearance'
            ? 'var(--color-accent-bg)'
            : 'transparent',
          color: settingsActive === 'Appearance'
            ? 'var(--accent-color)'
            : 'var(--color-text-primary)',
          border: settingsActive === 'Appearance'
            ? '1px solid var(--accent-color)'
            : '1px solid transparent',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (settingsActive !== 'Appearance') {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (settingsActive !== 'Appearance') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Cookie className='max-md:mr-2 mr-3 max-md:w-4 w-5' />
        Appearance
      </button>

      <button
        name='Accessibility'
        onClick={(e) => handleSettingsClick(e)}
        className="max-md:mr-2 rounded-lg py-1.5 max-md:py-1 pr-2 px-2.5 max-md:px-2 max-md:ml-2 flex items-center justify-baseline transition-all"
        style={{
          backgroundColor: settingsActive === 'Accessibility'
            ? 'var(--color-accent-bg)'
            : 'transparent',
          color: settingsActive === 'Accessibility'
            ? 'var(--accent-color)'
            : 'var(--color-text-primary)',
          border: settingsActive === 'Accessibility'
            ? '1px solid var(--accent-color)'
            : '1px solid transparent',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (settingsActive !== 'Accessibility') {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (settingsActive !== 'Accessibility') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <PersonStanding className='max-md:mr-2 mr-3 max-md:w-4 w-5' />
        Accessibility
      </button>

      <button
        name='Help & Support'
        onClick={(e) => handleSettingsClick(e)}
        className="max-md:mr-2 rounded-lg py-1.5 max-md:py-1 pr-2 px-2.5 max-md:px-2 max-md:ml-2 flex items-center justify-baseline transition-all"
        style={{
          backgroundColor: settingsActive === 'Help & Support'
            ? 'var(--color-accent-bg)'
            : 'transparent',
          color: settingsActive === 'Help & Support'
            ? 'var(--accent-color)'
            : 'var(--color-text-primary)',
          border: settingsActive === 'Help & Support'
            ? '1px solid var(--accent-color)'
            : '1px solid transparent',
          transitionDuration: 'var(--animation-duration)'
        }}
        onMouseEnter={(e) => {
          if (settingsActive !== 'Help & Support') {
            e.target.style.backgroundColor = 'var(--color-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (settingsActive !== 'Help & Support') {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <BadgeInfo className='max-md:mr-2 mr-3 max-md:w-4 w-5' />
        Help & Support
      </button>
    </div>
  )
}

export default SettingSideBar;
