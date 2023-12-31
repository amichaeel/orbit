import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';

const withAuth = (Component) => {
  return (props) => {
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
      const validateToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await fetch('/api/auth/validate', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            const data = await response.json();
            if (data.user) {
              setUser(data.user);
            } else {
              console.error('token validation failed: ', data.message);
            }
          } catch (error) {
            console.error('error validating token', error);
          }
        }
      }

      validateToken();
    }, []);

    return <Component {...props} />;
  };
};

export default withAuth;
