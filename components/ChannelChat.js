import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbtack, faCircleChevronDown, faUsers, faCircleDot, faGlobe, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const ChannelChat = ({ channelId, existingMessages, channelDescription, channelCreationDate }) => {
  const [messages, setMessages] = useState(existingMessages);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateCreated, setDateCreated] = useState('');

  useEffect(() => {
    setMessages(existingMessages)
  }, [existingMessages]);

  useEffect(() => {
    const lastSpace = channelCreationDate.lastIndexOf(" ");
    setDateCreated(channelCreationDate.substring(0, lastSpace) + ", " + channelCreationDate.substring(lastSpace+1))
  }, [dateCreated]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      {/* Dropdown Trigger */}
      <div className="flex justify-center items-center py-2 cursor-pointer hover:bg-neutral-800 transition-all" onClick={toggleDropdown}>
        <FontAwesomeIcon className={`h-5 w-5 rounded-sm text-neutral-500 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} icon={faCircleChevronDown} />
        {/* <ChevronDownIcon className={`h-5 w-5 bg-neutral-600 rounded-sm text-neutral-300 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} /> */}
      </div>

      {/* Dropdown Content */}
      <div
        className={`flex flex-row justify-center items-center w-full bg-neutral-900 text-neutral-300 border-b border-neutral-800 transition-all duration-1000 ease-in-out overflow-hidden ${dropdownOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        {/* Content only visible when dropdown is open */}
        {dropdownOpen && (
          <>
            <div className="mb-2 p-4 bg-neutral-700 m-2 rounded-lg hover:bg-neutral-500">
              <h2 className="text-xl font-light"><FontAwesomeIcon className='mr-2' icon={faCalendarDays} />created on</h2>
              <p>{dateCreated}</p>
            </div>
            <div className="mb-2 p-4 bg-neutral-700 m-2 rounded-lg hover:bg-neutral-500">
              <h2 className="text-xl font-light"><FontAwesomeIcon className='mr-2' icon={faThumbtack} />pinned message</h2>
              <p>pinned message goes here</p>
            </div>
            <div className="mb-2 p-4 bg-neutral-700 m-2 rounded-lg hover:bg-neutral-500">
              <h2 className="text-xl font-light">channel description</h2>
              <p>{channelDescription}</p>
            </div>
            <div className="mb-2 p-4 bg-neutral-700 m-2 rounded-lg hover:bg-neutral-500 flex flex-col items-center">
              <h2 className="text-xl font-light"><FontAwesomeIcon className='mr-2' icon={faUsers} />channel members</h2>
              <p className='text-l font-light'>{1}</p>
            </div>
            <div className="mb-2 p-4 bg-neutral-700 m-2 rounded-lg hover:bg-neutral-500 flex flex-col items-center">
              <div className='flex flex-row items-center'>
                <FontAwesomeIcon className='text-green-400 mr-2' icon={faGlobe} />
                <h2 className="text-xl font-light">online</h2>
              </div>
              {/* Display online members */}
              <p className='text-l font-light'>{1}</p>
            </div>
            {/* Future sections like pinned messages and active users */}
          </>
        )}
      </div>

      {/* Messages */}
      {messages.length > 0 ? (
        <div className="flex-1 overflow-hidden p-2 bg-neutral-900 w-full mb-24">
          <div className='flex flex-col scroll-m-9'>
            {messages.toReversed().map((message) => (
              <div key={message._id} className="py-2 hover:bg-neutral-800 transition-all rounded-lg text-neutral-300">
                <span className='mr-2 text-sm text-neutral-400'>{new Date(message.createdAt).toLocaleTimeString()}</span>
                <span class="text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-gray-700 text-gray-300">Founder</span>
                <span className='mr-2 text-neutral-400 text-sm'>{message.username}:  </span>
                <span className='text-neutral-200 text-sm'>{message.content}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='container flex flex-col mx-auto p-4'>
          <div className='text-4xl max-w-lg mx-auto font-bold text-gray-400 mb-4'>
            this channel is empty
          </div>
          <div className='max-w-lg mx-auto justify-center text-gray-500'>be the first to talk.</div>
        </div>
      )}
    </div>
  );
};

export default ChannelChat;
