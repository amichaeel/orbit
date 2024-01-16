import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import Navbar from '@/components/Navbar';
import ChannelChat from '@/components/ChannelChat';
import ChannelTextInput from '@/components/ChannelTextInput';
import withAuth from '@/components/withAuth';
import { UserContext } from '@/context/userContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth, faEarthAmerica, faLock } from '@fortawesome/free-solid-svg-icons';


function Channel() {
  const router = useRouter();
  const { channelName } = router.query;
  const [channelId, setChannelId] = useState(null);
  const [channelCreationDate, setChannelCreationDate] = useState('');
  const [messages, setMessages] = useState([]);
  const [channelFound, setChannelFound] = useState(false);
  const [preventAccess, setPreventAccess] = useState(false);
  const [channelMembers, setChannelMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [channelDescription, setChannelDescription] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);

  // validate and fetch channel messages

  useEffect(() => {
    setIsUser(!!user);
  }, [user])

  const checkIfMember = (username) => {
    if (channelMembers.includes(username)) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    async function validateAndFetchChannel() {
      try {
        // check if a channel exists.
        const findChannel = await fetch('/api/channels/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channelName }),
        })

        const data = await findChannel.json()
        if (data.found) {
          // channel exists. check if its private.
          if (!data.isPublic) { // channel is private, check if user is in list
            setIsPublic(false);
            setChannelMembers(data.users);
          }

          // public or not, get id and set found to true
          setChannelId(data.id);
          setChannelFound(true);
          setChannelDescription(data.description);
          setChannelCreationDate(data.createdOn);
          const resMessages = await fetch(`/api/messages/${data.id}`);
          const messagesData = await resMessages.json();

          if (resMessages.ok) {
            setMessages(messagesData);
          } else {
            console.error(`failed to fetch messages: ${messagesData.message}`);
          }
        }
      } catch (error) {
        console.error(`error validating or feetching channel: ${error}`)
        setError('Failed to load channel.')
      }

      setIsLoading(false)
    }

    if (channelName) {
      validateAndFetchChannel();
    }

  }, [user, channelName]);

  return (
    <div>
      {isLoading ? (
        <div className='flex flex-col h-screen'>
          <Navbar currentChannel={channelName} channelId={channelId} />
          <div className='flex items-center justify-center m-20'>
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <div>
          {isPublic && channelFound ? (
            <div className='flex flex-col h-screen'>
              <Navbar currentChannel={channelName} channelId={channelId} />
              <div className='flex-1 overflow-auto'>
                <ChannelChat channelId={channelId} channelDescription={channelDescription} channelCreationDate={channelCreationDate} existingMessages={messages} />
                <ChannelTextInput channelId={channelId} />
              </div>
            </div>
          ) : (
            <div>
              {channelFound ? (
                <div>
                  {isUser != false && checkIfMember(user.username) ? (
                    <div className='flex flex-col h-screen'>
                      <Navbar currentChannel={channelName} channelId={channelId} />
                      <div className='flex-1 overflow-auto'>
                        <ChannelChat channelId={channelId} existingMessages={messages} />
                        <ChannelTextInput channelId={channelId} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Navbar />
                      <div className='max-w-2xl mx-auto bg-neutral-800 p-6 rounded-lg shadow-lg'>
                        <div className='flex flex-col align-middle text-white/70 items-center justify-center'>
                          <FontAwesomeIcon className='text-6xl mb-10' icon={faLock} />
                          <p className='font-medium text-md mb-2'>sorry, this channel is private</p>
                          <p className='font-light text-xs mb-5'>access is restricted to members only.</p>
                          <p className='cursor-pointer font-light text-xs  hover:text-white border  focus:ring-4 focus:outline-none rounded-lg px-5 py-2.5 text-center me-2 mb-2 border-gray-600 text-gray-400  hover:bg-gray-600 focus:ring-gray-800' onClick={() => window.location.href = "/"}>go home</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Navbar />
                  <div className='max-w-2xl mx-auto bg-neutral-800 p-6 rounded-lg shadow-lg'>
                        <div className='flex flex-col align-middle text-white/70 items-center justify-center'>
                          <FontAwesomeIcon className='text-6xl mb-10' icon={faEarthAmerica} />
                          <p className='font-medium text-md mb-2'>we looked every! this channel could not be found</p>
                          <p className='font-light text-xs mb-5'>please check your spelling, or create the channel yourself!</p>
                          <p className='cursor-pointer font-light text-xs  hover:text-white border  focus:ring-4 focus:outline-none rounded-lg px-5 py-2.5 text-center me-2 mb-2 border-gray-600 text-gray-400  hover:bg-gray-600 focus:ring-gray-800' onClick={() => window.location.href = "/"}>go home</p>
                        </div>
                      </div>
                </div>
              )}
            </div>
          )}
        </div>
      )
      }
    </div >
  );
}

export default withAuth(Channel)