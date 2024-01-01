import React, { useState, useEffect, useContext } from 'react';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '@/context/userContext';

function Create() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channelNameLength, setChannelNameLength] = useState(15);
  const [descriptionLength, setDescriptionLength] = useState(150)
  const [isPublic, setIsPublic] = useState(true);
  const [isNSFW, setIsNSFW] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [error, setError] = useState('');
  const [newChannelName, setNewChannelName] = useState(null);
  const { user } = useContext(UserContext);
  const [val, setVal] = useState();
  const Router = useRouter();

  useEffect(() => {
    if (user != null) setIsUser(true)
  })

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        Router.push(`/channel/${newChannelName}`)
      }, 3000)
    }
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
      username: user.username,
      isNSFW
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
                onChange={(e) => {
                  const input = e.target.value.trim();
                  if (/^[a-z0-9-]*$/.test(input)) {
                    setName(input);
                    setChannelNameLength(15 - input.length);
                  }
                }}
                className="w-fullbg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isSuccess}
                maxLength={15}
                placeholder='channel/'
                required
              />
            </div>
            {channelNameLength == 0 ? (
              <p id="floating_helper_text" class="mb-2 text-xs text-red-500 dark:text-red-400">{channelNameLength} characters remaining.</p>
            ) : (
              <p id="floating_helper_text" class="mb-2 text-xs text-gray-500 dark:text-gray-400">{channelNameLength} characters remaining.</p>
            )}
            <div className="mb-4">
              <label htmlFor="channel-description" className="block text-lg font-light mb-1">description</label>
              <textarea
                id="channel-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setDescriptionLength(150 - e.target.value.length)
                }}
                className="w-full block p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                maxLength={150}
                disabled={isSuccess}
                required
              ></textarea>
            </div>

            {descriptionLength == 0 ? (
              <p id="floating_helper_text" class="mb-3 text-xs text-red-500 dark:text-red-400">{descriptionLength} characters remaining.</p>
            ) : (
              <p id="floating_helper_text" class="mb-3 text-xs text-gray-500 dark:text-gray-400">{descriptionLength} characters remaining.</p>
            )}

            <span className="block text-lg font-light mb-1">specifications</span>
            <div className='flex flex-col'>
              <label class="relative inline-flex items-center cursor-pointer mb-4 mr-3">
                <input type="checkbox" checked={isPublic} disabled={isSuccess || isLoading} onChange={(e) => setIsPublic(e.target.checked)} value="" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-400"></div>
                <span class="ms-3 mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {isPublic ? (
                    'public'
                  ) : (
                    'private'
                  )}
                </span>
                {isPublic ? (
                  <span className='font-light text-sm text-gray-400'>anyone can view, chat, and join this channel</span>
                ) : (
                  <span className='font-light text-sm text-gray-400'>only approved users can view and chat in this channel</span>
                )}
              </label>

              <label class="relative inline-flex items-center cursor-pointer mb-4">
                <input type="checkbox" checked={isNSFW} disabled={isSuccess || isLoading} onChange={(e) => setIsNSFW(e.target.checked)} value="" class="sr-only peer" />
                <div class="w-11 h-6 mr-3 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-400"></div>
                <span class="bg-red-100 text-red-800 text-sm font-medium me-2 px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">NSFW</span>
                <span className='font-light text-sm text-gray-400'>18+ year old users only</span>
              </label>
            </div>

            <button type="submit" disabled={isSuccess || isLoading} className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 w-full">{isLoading ? <LoadingSpinner /> : isSuccess ? <FontAwesomeIcon icon={faCheck} /> : 'create channel'}</button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {isSuccess && newChannelName && (
              <div className="m-3 flex justify-center">
                <span className='text-green-700 border border-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-light rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:focus:ring-green-800'>channel successfully created. you will be redirected momentarily.</span>
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
