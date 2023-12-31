import React, { useEffect, useState } from 'react';
// import Message from '@/models/Message';

// import { io } from 'socket.io-client';

// const socket = io(process.env.NEXT_PUBLIC_API_URL);

const ChannelChat = ({ channelId, existingMessages }) => {
  const [messages, setMessages] = useState(existingMessages);

  // implement listener for new messages in the database. should listen for messages with the same channelId

  useEffect(() => {
    setMessages(existingMessages)
  }, [existingMessages]);

  // useEffect(() => {
  //   socket.emit('joinChannel', channelId);

  //   socket.on('newMessage', (newMessage) => {
  //     setMessages((prevMessages) => [...prevMessages, newMessage])
  //   })

  //   return () => {
  //     socket.off('newMessage');
  //     socket.emit('leaveChannel', channelId);
  //   }
  // })

  return (
    <div>
      {messages.length > 0 ? (
        <div className="flex-1 overflow-hidden p-2 bg-neutral-900 w-full mb-24"> {/* Ensure full width */}
          <div className='flex flex-col scroll-m-9 '>
            {messages.toReversed().map((message) => (
              <div key={message._id} className="py-2 hover:bg-neutral-800 transition-all rounded-lg text-neutral-300">
                {/* Formatting the date from createdAt */}
                <span className='mr-2 text-sm text-neutral-400'>{new Date(message.createdAt).toLocaleTimeString()}</span>
                {/* Placeholder for username until user details are implemented */}
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