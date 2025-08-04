import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsActive } from '../redux/features/user';
import { BadgeInfo, BellDot, Cookie, EarthLock, Keyboard, PersonStanding, UserPen } from 'lucide-react';

const SettingSideBar = (props) => {

  const { showMenu } = props;

  const { settingsActive } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();

  const handleSettingsClick = (e) => {
    const { name } = e.target;
    dispatch(setSettingsActive(name));
  }

  return (
    <div
      className={`${showMenu ? 'translate-x-0' : '-translate-x-full absolute'} z-15 bg-white scroll h-[calc(100vh-65px)] w-[264px] max-md:absolute overflow-y-scroll transition-transform duration-1000 ease-in-out scroll-smooth text-xl py-3 max-md:py-1.5 px-1 max-md:px-0  max-md:text-lg space-y-2 max-md:space-y-1 flex flex-col shadow-md max-md:h-[calc(100vh-65px)]`}
    >
      <button name='Accounts' onClick={(e) => handleSettingsClick(e)} className={`${settingsActive === 'Accounts' ? 'bg-gray-100 rounded-lg' : ''} py-1.5 max-lg:text-lg max-md:py-1 pr-2 px-2.5 mx-2.5 max-md:mx-2 max-md:px-2 active:bg-gray-200  max-md:ml-2 flex items-center justify-baseline`}>
        <UserPen className='max-md:mr-2 mr-3 max-md:w-4 max-lg:w-6' />
        Accounts
      </button>
      <button name='Privacy & Security' onClick={(e) => handleSettingsClick(e)} className={`${settingsActive === 'Privacy & Security' ? 'bg-gray-100 rounded-lg' : ''} max-lg:text-lg py-1.5 max-md:py-1 pr-2 active:bg-gray-200 px-2.5 mx-2.5 max-md:mx-2 max-md:px-2  max-md:ml-2 flex items-center justify-baseline`}>
        <EarthLock className='max-md:mr-2 mr-3 max-md:w-4 max-lg:w-6' />
        Privacy & Security
      </button>
      <button name='Notification Settings' onClick={(e) => handleSettingsClick(e)} className={`${settingsActive === 'Notification Settings' ? 'bg-gray-100 rounded-lg' : ''} max-lg:text-lg py-1.5 active:bg-gray-200 max-md:py-1 pr-2 px-2.5 max-lg:p-1 mx-2.5 max-md:mx-2 max-md:px-2  max-md:ml-2 flex items-center justify-baseline`}>
        <BellDot className='max-md:mr-2 mr-3 max-md:w-4 max-lg:w-6' />
        Notification Settings
      </button>
      <button name='Appearance' onClick={(e) => handleSettingsClick(e)} className={`${settingsActive === 'Appearance' ? 'bg-gray-100 rounded-lg' : ''} max-lg:text-lg py-1.5 max-md:py-1 pr-2 px-2.5 active:bg-gray-200 mx-2.5 max-md:mx-2 max-md:px-2  max-md:ml-2 flex items-center justify-baseline`}>
        <Cookie className='max-md:mr-2 mr-3 max-md:w-4 max-lg:w-6' />
        Appearance
      </button>
      <button name='Accessibility' onClick={(e) => handleSettingsClick(e)} className={`${settingsActive === 'Accessibility' ? 'bg-gray-100 rounded-lg' : ''} max-lg:text-lg py-1.5 max-md:py-1 pr-2 active:bg-gray-200 px-2.5 mx-2.5 max-md:mx-2 max-md:px-2  max-md:ml-2 flex items-center justify-baseline`}>
        <PersonStanding className='max-md:mr-2 mr-3 max-md:w-4 max-lg:w-6' />
        Accessibility
      </button>
      <button name='Help & Support' onClick={(e) => handleSettingsClick(e)} className={`${settingsActive === 'Help & Support' ? 'bg-gray-100 rounded-lg' : ''} max-lg:text-lg py-1.5 max-md:py-1 pr-2 active:bg-gray-200 hover:bg-gray-150 px-2.5 mx-2.5 max-md:mx-2 max-md:px-2  max-md:ml-2 flex items-center justify-baseline`}>
        <BadgeInfo className='max-md:mr-2 mr-3 max-md:w-4 max-lg:w-6' />
        Help & Support
      </button>
    </div>
  )
}

export default SettingSideBar
