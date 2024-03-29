import React, { useState, useContext, useEffect, useRef } from 'react';
import Router from 'next/router';
import Modal from 'react-modal';
import LoginModal from './LoginModal';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';
import withAuth from './withAuth';
import { UserContext } from '../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faTimes, faSignOutAlt, faSearch, faSquarePlus, faBell, faBellSlash, faCircle, faUser, faGlobe, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

Modal.setAppElement('#__next'); // Set a root element for accessibility reasons

const Navbar = ({ currentChannel, channelId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [joinChannelLoading, setJoinChannelLoading] = useState(false);
  const [friendRequestsAmount, setFriendRequestsAmount] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [joined, setJoined] = useState(false);
  const [showFriendRequestsDropdown, setShowFriendRequestsDropdown] = useState(false);
  const [error, setError] = useState('');
  const Router = useRouter();

  useEffect(() => {
    if (user && user.friendRequests.length > 0) {
      setFriendRequestsAmount(user.friendRequests.length);
      setFriendRequests(user.friendRequests);
    }
  });

  const dropdownRef = useRef(null); // Create a ref for the dropdown

  useEffect(() => {
    // Function to detect click outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFriendRequestsDropdown(false); // Close the dropdown
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Only re-run the effect if dropdownRef changes

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogin = (username) => {
    setUser({ username: username });
    closeModal();
    Router.reload();
  };

  const toggleFriendRequestsDropdown = () => {
    setShowFriendRequestsDropdown(!showFriendRequestsDropdown);
  };

  const handleAcceptFriendRequest = async (username) => {
    const obj = {
      senderUsername: username,
      accepterUsername: user.username
    }

    try {
      const response = await fetch('/api/user/friend-accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })

      const data = response.json();

      if (response.ok) {
        console.log('friend request accepted!')
      } else {
        console.error('failed to accept friend request ' + data.message);
        setFriendRequests(friendRequests.filter(request => request !== username));
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      setError('Failed to accept request: ' + error.message);
    }
  };

  // Decline friend request function
  const handleDeclineFriendRequest = async (username) => {
    const obj = {
      senderUsername: username,
      recipientUsername: user.username
    }

    try {
      const response = await fetch('/api/user/friend-decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })

      const data = response.json();

      if (response.ok) {
        console.log('friend request declined successfully')
      } else {
        console.error('failed to decline friend request ' + data.message);
        setFriendRequests(friendRequests.filter(request => request !== username));
      }
    } catch (error) {
      console.error('Failed to decline request:', error);
      setError('Failed to decline request: ' + error.message);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    Router.reload()
  }

  const handleJoinChannel = async (event) => {
    event.preventDefault();
    setJoinChannelLoading(true)

    if (!user) {
      openModal()
      setJoinChannelLoading(false);
      return;
    }

    const obj = {
      username: user.username,
      userId: user._id,
      channelName: currentChannel,
      channelId: channelId,
    }

    try {
      const response = await fetch('/api/channels/joinPublic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })

      const data = await response.json();

      if (response.ok && data.joined) {
        console.log('channel joined successfully')
        setJoined(true);
        Router.reload();
      }
    } catch (error) {
      console.error('Failed to send request', error);
      setError('Failed to send request: ' + error.message);
    } finally {
      setJoinChannelLoading(false);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-neutral-950 text-white p-4">
      <div className="flex items-center">
        <span onClick={() => window.location.href = '/'} className='font-thin text-2xl cursor-pointer mr-3'>orbit</span>
        {currentChannel ? (
          <div className="mr-3">
            <span className='text-lg mr-3'>#{currentChannel}</span>
            <span onClick={handleJoinChannel} className='cursor-pointer border focus:ring-4 focus:outline-none font-light rounded-md text-sm px-2 py-1 text-center me-2 mb-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800'>
              <div className="inline-block">
                {((user && user.channels.includes(currentChannel)) || joined) ? (
                  <div classNam='inline-block'>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                ) : (
                  <div>
                    {!joinChannelLoading ? (
                      <FontAwesomeIcon icon={faPlus} />
                    ) : (
                      <LoadingSpinner />
                    )}
                  </div>
                )}
              </div>
            </span>
            <FontAwesomeIcon className='text-green-400 text-xs mr-2' icon={faGlobe} />
            <span className='text-sm font-light mr-3'>1</span>
          </div>
        ) : (
          <div></div>
        )}
        <span onClick={() => window.location.href = '/browse'} className='mr-3 text-neutral-400 cursor-pointer hover:text-opacity-90'><FontAwesomeIcon icon={faSearch} /></span>
        <span onClick={() => window.location.href = '/create'} className='text-neutral-400 cursor-pointer hover:text-opacity-90'><FontAwesomeIcon icon={faSquarePlus} /></span>
      </div>

      <div>
        {user ? (
          <div className="flex items-center">
            {friendRequestsAmount > 0 && (
              <div onClick={toggleFriendRequestsDropdown} className='cursor-pointer relative'>
                <FontAwesomeIcon className="mr-3 text-[20px]" icon={faUser} />
                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-red-100 bg-red-600 rounded-full'>{friendRequestsAmount}</span>
              </div>
            )}
            <div className='relative' ref={dropdownRef}>
              {showFriendRequestsDropdown && (
                <div className="absolute z-10 w-48 bg-neutral-800 shadow-lg rounded-lg mt-2 py-2 right-0">
                  {friendRequests.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-700">No friend requests</div>
                  ) : (
                    friendRequests.map((request, index) => (
                      <div key={index} onClick={() => window.location.href=`/user/${request}`}className="flex items-center cursor-pointer hover:text-gray-300 justify-between px-4 py-2 text-sm text-gray-100">
                        {request}
                        <div>
                          <button onClick={() => handleAcceptFriendRequest(request)} className="text-green-600 hover:text-green-800"><FontAwesomeIcon icon={faCheck} /></button>
                          <button onClick={() => handleDeclineFriendRequest(request)} className="text-red-600 hover:text-red-800 ml-2"><FontAwesomeIcon icon={faTimes} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            <span onClick={() => window.location.href = `/user/${user.username}`} className="cursor-pointer hover:text-neutral-200 mr-4">{user.username}</span>
            <button onClick={handleLogout} className="hover:text-slate-50 mr-3">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        ) : (
          <button onClick={openModal} className="inline-flex items-center justify-center h-8 px-6 py-0 text-sm font-semibold text-center text-gray-200 no-underline align-middle transition-all duration-300 ease-in-out bg-transparent border-2 border-gray-600 border-solid rounded-full cursor-pointer select-none hover:text-white hover:border-white focus:shadow-xs focus:no-underline">
            <FontAwesomeIcon icon={faSignInAlt} />
          </button>
        )}
      </div>
      <LoginModal modalIsOpen={modalIsOpen} closeModal={closeModal} onLogin={handleLogin} setUser={setUser} />
    </nav>
  );
};


export default withAuth(Navbar);

/**
 * TODO
 * if you received a friend request and visit that users page, you should not be able to send request, rather only accept or deny.
 */