import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlock, faLock, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function Browse() {
  const [channels, setChannels] = useState([])
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChannels() {
      try {
        const response = await fetch('/api/channels/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setChannels(data);
        } else {
          setError('Failed to load channels. Please try again later.');
        }
      } catch (error) {
        console.error(`Error fetching channels: ${error}`);
        setError('Error fetching channels. Please contact an administrator.');
      }
    }
    loadChannels();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-400 mb-4">browse channels</h1>
        {error && <p className="text-red-600">{error}</p>}
        <ul>
          {channels.map(channel => (
            <li key={channel._id} onClick={() => window.location.href = `/channel/${channel.name}`} className="flex cursor-pointer justify-between items-center bg-gray-800 text-white p-3 rounded-lg mb-2 max-h-14 hover:bg-gray-700 transition-all">
              <div>
                <span className="font-medium">{channel.name}</span>
                <span className={`text-xs me-2 ml-3 px-2.5 py-0.5 rounded-full ${channel.isPublic ? 'bg-green-100 text-green-800  dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                  {channel.isPublic ? 'public' : 'private' }
                </span>
              </div>
              {channel.isPublic && (
                <button
                  onClick={() => window.location.href = `/channel/${channel.name}`}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(Browse);
