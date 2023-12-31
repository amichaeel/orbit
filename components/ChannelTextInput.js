import React, { useState, useContext } from "react";
import { UserContext } from '@/context/userContext';

const ChannelTextInput = ({ channelId }) => {
  const [text, setText] = useState('');
  const [showLoginReminder, setShowLoginReminder] = useState(false);
  const { user } = useContext(UserContext);

  // on submit, we sent a post requrest to message post with info
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user == null) {
      setShowLoginReminder(true); // Show the login reminder
      setTimeout(() => setShowLoginReminder(false), 3000); // Hide it after 3 seconds
      return;
    }

    const messageData = {
      content: text,
      userId: user._id,
      username: user.username,
      nonce: "testing",
      channel: channelId
    }

    await fetch('/api/messages/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    }).then(resp => {
      if (resp.status === 201) {
        console.log('message sent')
        setText('');
        // socket.emit('sendMessage', messageData);

      } else {
        console.log(`error sending message: `);
        console.log(resp)
        // Promise.reject("server");
      }
    })
  }

  return (
    <div className="flex flex-row fixed bottom-0 inset-x-0 py-5 p-3 inputColor">
      <form className="w-full flex items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-neutral-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-e-slate-900'
        />
        <button className="m-2 text-white bg-neutral-900 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-neutral-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" type="submit">Send</button>
        {showLoginReminder && (
          <div className="absolute -top-10 right-0 bg-red-600 text-white p-2 m-3 rounded">
            Please log in to chat!
          </div>
        )}
      </form>
    </div>
  )
}

export default ChannelTextInput;