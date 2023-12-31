import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import Navbar from '@/components/Navbar';
import ChannelChat from '@/components/ChannelChat';
import ChannelTextInput from '@/components/ChannelTextInput';
import withAuth from '@/components/withAuth';
import { UserContext } from '@/context/userContext';
import LoadingSpinner from '@/components/LoadingSpinner';


function Channel() {
  const router = useRouter();
  const { channelName } = router.query;
  const [channelId, setChannelId] = useState(null);
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
                <ChannelChat channelId={channelId} channelDescription={channelDescription} existingMessages={messages} />
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
                      <div className='flex text-lg justify-center'>Channel is private. Access is restricted to members only.</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Navbar />
                  <div className='flex text-lg justify-center'>Channel not found :(</div>
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