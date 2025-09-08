import React, { useEffect, useState } from 'react'
import SettingSideBar from "../components/SettingSideBar";
import SettingMain from "../components/SettingMain";
import Header from "../components/Header";
import { useSelector } from 'react-redux';


const Settings = () => {

  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768) setShowMenu(false);
  }, []);

  const { loggedIn } = useSelector((state) => state.user);

  return (
    <div >
      {loggedIn ? (<div>
        <Header menuToggle={{ showMenu: showMenu, setShowMenu: setShowMenu }} />
        <div className='flex h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] overflow-hidden'>
          <SettingSideBar showMenu={showMenu} setShowMenu={setShowMenu} />
          <div className='w-full'>
            <SettingMain />
          </div>
        </div>
      </div>) : (
        <div>Please log in to access settings.</div>
      )}
    </div>
  )
}

export default Settings
