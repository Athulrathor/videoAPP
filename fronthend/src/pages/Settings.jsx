import React, { useEffect, useState } from 'react'
import SettingSideBar from "../components/SettingSideBar";
import SettingMain from "../components/SettingMain";
import Header from "../components/Header";
import { useSelector } from 'react-redux';
import { useAppearance } from '../hooks/appearances';

const Settings = () => {
  const [showMenu, setShowMenu] = useState(true);
  const { appearanceSettings } = useAppearance();

  useEffect(() => {
    if (window.innerWidth <= 768) setShowMenu(false);
  }, []);

  const { loggedIn } = useSelector((state) => state.user);

  return (
    <div
      className="min-h-screen transition-all"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
        backgroundImage: 'var(--background-image)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transitionDuration: 'var(--animation-duration)'
      }}
    >
      {loggedIn ? (
        <div className="h-screen overflow-hidden">
          <Header
            menuToggle={{ showMenu: showMenu, setShowMenu: setShowMenu }}
          />
          <div
            className='flex h-[calc(100vh_-_57px)] max-md:h-[calc(100vh_-_41px)] overflow-hidden'
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <SettingSideBar
              showMenu={showMenu}
              setShowMenu={setShowMenu}
            />
            <div
              className='w-full overflow-hidden transition-all'
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                transitionDuration: 'var(--animation-duration)'
              }}
            >
              <SettingMain />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-center h-screen transition-all"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-lg)',
            fontFamily: 'var(--font-family)',
            transitionDuration: 'var(--animation-duration)'
          }}
        >
          <div
            className="text-center p-8 rounded-lg shadow-lg transition-all"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              transitionDuration: 'var(--animation-duration)'
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-2xl)'
              }}
            >
              Access Denied
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              Please log in to access settings.
            </p>
            <button
              className="mt-4 px-6 py-2 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
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
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings;
