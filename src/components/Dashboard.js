import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if the user is not an admin
  React.useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/'); // Redirect to the home page or another appropriate route
    }
  }, [currentUser, isAdmin, navigate]);

  if (!currentUser || !isAdmin) {
    return <div>Access Denied</div>; // Fallback message while redirecting
  }

  return (
    <div>
      <iframe
        title="marketplaceweb"
        width="1140"
        height="541.25"
        src="https://app.powerbi.com/reportEmbed?reportId=a93be8fa-b1ef-411d-a1b6-795910ea8f0b&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default Dashboard;
