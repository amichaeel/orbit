import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import LoginModal from './LoginModal';
import Image from 'next/image';
import { UserContext } from '../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSignOutAlt, faSearch, faSquarePlus, faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';


Modal.setAppElement('#__next'); // Set a root element for accessibility reasons

const Navbar = ({ currentChannel }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    Router.reload()
  }

  return (
    <nav className="flex justify-between items-center bg-zinc-950 text-white p-4">
      <div className="flex items-center">
        {/* <Image className='cursor-pointer' onClick={() => window.location.href = '/'} src='/images/logo.png' width={64} height={64} alt="quasar-logo" /> */}
        <span onClick={() => window.location.href = '/'} className='font-thin text-2xl cursor-pointer mr-3'>orbit</span>
        <span className='text-lg mr-3'>{currentChannel ? ( `#${currentChannel}`) : ('')}</span>
        <span onClick={() => window.location.href = '/browse'} className='mr-3 text-neutral-400 cursor-pointer hover:text-opacity-90'><FontAwesomeIcon icon={faSearch}/></span>
        <span onClick={() => window.location.href = '/create'} className='text-neutral-400 cursor-pointer hover:text-opacity-90'><FontAwesomeIcon icon={faSquarePlus}/></span>
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


export default Navbar;
