import React from 'react'
import { useSelector } from 'react-redux';

const Subscription = () => {

  const { loggedIn } = useSelector((state) => state.user);

  return (

    // user profile page
    // user subscription page

    <div className="h-screen">
      {loggedIn === false ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Welcome to the Main Page</h1>
          <p className="mt-4 text-gray-500">This is the main content area.</p>
        </div>
      ) : (
        <div className=" scroll grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-3">
          {loggedIn === true && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-3xl font-bold text-center">Welcome to the Subscription Page</h1>
              <p className="mt-4 text-gray-500 text-center">This is the subscription content area.</p>
            </div>
          )}
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-2xl font-semibold">Your Subscriptions</h2>
            {/* Add subscription list here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription
