import React, { useState } from 'react';
import Modal from 'react-modal';
import Router from 'next/router';

const LoginModal = ({ modalIsOpen, closeModal, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState({ lengtgh: false, number: false, special: false });
  const [passwordError, setPasswordError] = useState({ length: false, number: false, special: false });

  const [error, setError] = useState('');
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login and Signup view

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // clear any existing errors
    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/signup';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Tyoe': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser({ username });
      closeModal();
      Router.reload();
    } else {
      setError(data.message || 'An error occured.');
      console.error(data.message || "an error occured.");
    }
  }

  const validatePassword = (password) => {
    const errors = {};
    errors.length = password.length >= 8;
    errors.number = /\d/.test(password); // Contains a number
    errors.special = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Contains a special character
    return errors
  }

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(validatePassword(value));
  }

  const modalStyle = {
    overlay: {
      inset: '0px',
      background: '#000000d1',
      position: 'fixed',
    },
    content: {
      background: 'rgb(5,5,5)',
      borderRadius: '10px',
      border: 'none',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
    }
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => {
        setError("");
        closeModal();
      }}
      style={modalStyle}
      contentLabel="Login"
    >
      {/* <h2>{isLogin ? 'Login' : 'Sign Up'}</h2> */}
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className='mb-5'>
          <label htmlFor="username" className='block mb-2 text-sm font-medium text-zinc-900 dark:text-white'>Username</label>
          <input type="text" className='bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className='mb-5'>
          <label htmlFor="password" className='block mb-2 text-sm font-medium text-zinc-900 dark:text-white'>Password</label>
          <input type="password" className='bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="Password" onChange={handlePasswordChange} required />
        </div>
        <button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-zinc-900 focus:outline-none bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700" type="submit">{isLoginView ? 'Login' : 'Sign Up'}</button>
        <button className='text-zinc-900 hover:text-white border border-zinc-800 hover:bg-zinc-900 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-zinc-600 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-zinc-800' onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView ? 'Need to create an account?' : 'Already have an account?'}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>} {/* Display error message */}
        {!isLoginView && <div className={passwordError.length && passwordError.number && passwordError.special ? "hidden" : "text-sm"}>
          <p className='text-white'>Password must contain:</p>
          <ul>
            <li className={passwordError.length ? "text-green-500" : "text-red-500"}>At least 8 characters</li>
            <li className={passwordError.number ? "text-green-500" : "text-red-500"}>At least one number</li>
            <li className={passwordError.special ? "text-green-500" : "text-red-500"}>At least one special character</li>
          </ul>
        </div>}
      </form>
    </Modal>
  );
};

export default LoginModal;
