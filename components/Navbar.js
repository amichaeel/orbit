import React, { useState, useContext, useEffect } from 'react';
import Router from 'next/router';
import Modal from 'react-modal';
import LoginModal from './LoginModal';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';
import withAuth from './withAuth';
import { UserContext } from '../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSignOutAlt, faSearch, faSquarePlus, faBell, faBellSlash, faCircle, faGlobe, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';


Modal.setAppElement('#__next'); // Set a root element for accessibility reasons

const Navbar = ({ currentChannel, channelId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [joinChannelLoading, setJoinChannelLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const Router = useRouter();

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
        {/* <Image className='cursor-pointer' onClick={() => window.location.href = '/'} src='/images/logo.png' width={64} height={64} alt="quasar-logo" /> */}
        <span onClick={() => window.location.href = '/'} className='font-thin text-2xl cursor-pointer mr-3'>orbit</span>
        {currentChannel ? (
          <div className="mr-3">
            <span className='text-lg mr-3'>#{currentChannel}</span>
            <span onClick={handleJoinChannel} className='cursor-pointer text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-light rounded-md text-sm px-2 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800'>
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
            <span class="mr-3" ><FontAwesomeIcon icon={faBell} /></span>
            <span className="mr-4">{user.username}</span>
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