import React, { useState, useContext, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';


function Join() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState({ lengtgh: false, number: false, special: false });
  const [passwordError, setPasswordError] = useState({ length: false, number: false, special: false });
  const [isUser, setIsUser] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const [isSuccess, setIsSuccess] = useState(false); // To handle success state
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user != null) {
      setIsUser(true);
      router.push('/browse')
    }
  })

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => router.push('/browse'), 2000)
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // clear any existing errors
    setIsLoading(true);
    const endpoint = '/api/auth/signup';

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
      setIsSuccess(true);
    } else {
      setError(data.message || 'An error occured.');
      console.error(data.message || "an error occured.");
      setIsLoading(false);
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

  return (
    <div>
      <Navbar />
      {!isUser ? (
        <div className='container mx-auto p-4'>
          <div className='max-w-sm mx-auto'>
            {isLoading ? (
              <div className='flex justify-center items-center min-h-[200px]'>
                <LoadingSpinner />
              </div>
            ) : isSuccess ? (
              <div className='text-center'>
                <FontAwesomeIcon icon={faCheck} className='text-6xl' />
                <p className='text-medium text-gray-400 mt-4'>Success! Redirecting...</p>
              </div>
            ) : (
              <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold text-gray-400 mb-4">join orbit</h1>
                <div className='mb-5'>
                  <label htmlFor="username" className='block mb-2 text-sm font-medium text-white/70'>Username</label>
                  <input type="text" className='border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white' placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className='mb-5'>
                  <label htmlFor="password" className='block mb-2 text-sm font-medium text-white/70'>Password</label>
                  <input type="password" className=' border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white' placeholder="Password" onChange={handlePasswordChange} required />
                </div>
                <button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-zinc-700 bg-zinc-800 text-zinc-400 border-zinc-600 hover:text-white hover:bg-zinc-700" type="submit">Sign Up</button>
                {<div className={passwordError.length && passwordError.number && passwordError.special ? "hidden" : "text-sm"}>
                  <p className='text-white'>Password must contain:</p>
                  <ul>
                    <li className={passwordError.length ? "text-green-500" : "text-red-500"}>At least 8 characters</li>
                    <li className={passwordError.number ? "text-green-500" : "text-red-500"}>At least one number</li>
                    <li className={passwordError.special ? "text-green-500" : "text-red-500"}>At least one special character</li>
                  </ul>
                </div>}
              </form>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>} {/* Display error message */}
          </div>
        </div>
      ) : (
        <div>Already logged in.</div>
      )}
    </div>
  )
}

export default withAuth(Join);