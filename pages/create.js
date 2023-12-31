import React, { useState, useEffect, useContext } from 'react';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '@/context/userContext';

function Create() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [error, setError] = useState('');
  const [newChannelName, setNewChannelName] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user != null) setIsUser(true)
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    const channelData = {
      name,
      description,
      isPublic,
      username: user.username
    };

    console.log(channelData)

    try {
      const response = await fetch('/api/channels/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(channelData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Channel created:', data);
        setIsSuccess(true);
        setNewChannelName(data.name);
      } else {
        setError('Failed to create channel: ' + (data.message || 'Please try again later'));
      }
    } catch (error) {
      console.error('Failed to send request:', error);
      setError('Failed to send request: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Navbar />
      {isUser ? (
        <div className="container mx-auto p-4">
          <h1 className="text-4xl max-w-lg mx-auto font-bold text-gray-400 mb-4">create a channel</h1>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="channel-name" className="block text-lg font-light mb-1">channel name</label>
              <input
                id="channel-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-fullbg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isSuccess}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="channel-description" className="block text-lg font-light mb-1">description (max 150 characters)</label>
              <textarea
                id="channel-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full block p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                maxLength="150"
                disabled={isSuccess}
                required
              ></textarea>
            </div>
            <label class="relative inline-flex items-center cursor-pointer mb-4">
              <input type="checkbox" checked={isPublic} disabled={isSuccess || isLoading} onChange={(e) => setIsPublic(e.target.checked)} value="" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-400"></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">public channel</span>
            </label>
            <button type="submit" disabled={isSuccess || isLoading} className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 w-full">{isLoading ? <LoadingSpinner /> : isSuccess ? <FontAwesomeIcon icon={faCheck} /> : 'create channel'}</button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {isSuccess && newChannelName && (
              <div className="mt-2">
                <span>channel successfully created.</span>
                <a href={`/channel/${newChannelName}`} className="text-slate-300"> Visit your channel.</a>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-300 mb-4">You must be logged in to create a channel.</p>
        </div>
      )}
    </div>
  );
}

export default withAuth(Create);
