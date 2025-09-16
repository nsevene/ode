import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new philosophy page
    navigate('/philosophy', { replace: true });
  }, [navigate]);

  return null;
};

export default About;