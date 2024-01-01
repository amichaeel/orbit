// pages/user/[username].js

import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserClock, faUserCheck, faPlus, faCheck, faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '@/context/userContext';

function UserPage() {
  const router = useRouter();
  const { username } = router.query;
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (username) {
      setIsLoading(true);
      fetch(`/api/user/${username}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch');
        })
        .then((data) => {
          setUserDetails(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    }
  }, [username]);

  const sendFriendRequest = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!user) {
      alert('Please log in!');
      setIsLoading(false);
      return;
    }

    if (user.outgoingFriendRequests.includes(username) || user.friends.includes(username)) {
      setIsLoading(false);
      return;
    }

    try {
      const obj = {
        senderUsername: user.username,
        recipientUsername: username,
      }

      const response = await fetch('/api/user/friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      });

      const data = await response.json()
      if (response.ok) {
        setFriendRequestSent(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to send request');
    } setIsLoading(false)
  }

  const friendRequestIcon = () => {
    if (user?.outgoingFriendRequests.includes(username)) {
      return faUserClock; // Waiting for response
    } else if (user?.friends.includes(username)) {
      return faUserCheck; // Already friends
    }
    return faUserPlus; // Default to add friend
  };

  const isOwnProfile = user && user.username === username;

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      {isLoading ? (
        <div>
          <LoadingSpinner />
        </div>

      ) : (
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
              {
                userDetails ? (
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-3xl font-bold mr-2 mb-2">{userDetails.username}</h1>
                      {!isOwnProfile && (
                        <div>
                          <button onClick={sendFriendRequest} className="text-white text-xs hover:bg-neutral-700 p-2 rounded inline-flex items-center">
                            {friendRequestSent ? (
                              <FontAwesomeIcon icon={faUserClock} />
                            ) : (
                              <FontAwesomeIcon icon={friendRequestIcon()} />
                            )}
                          </button>
                          <button className="text-white text-xs hover:bg-neutral-700 p-2 rounded inline-flex items-center">
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>

                      )}
                    </div>
                    <div className="mb-4">
                      <h2 className="text-sm">User Since: {new Date(userDetails.createdAt).toLocaleDateString()}</h2>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center'>
                    <FontAwesomeIcon className='text-6xl mb-10' icon={faHeartCrack} />
                    <p className='font-medium text-md mb-2'>sorry, a user by that name could not be identified</p>
                    <p className='font-light text-xs mb-5'>the person may have been banned or the username is incorrect</p>
                    <p className='cursor-pointer font-light text-xs text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800' onClick={() => window.location.href = "/"}>go home</p>
                  </div>
                )
              }
            </div >
          </div >
        </div >
      )}
    </div>
  );
}

export default withAuth(UserPage);
