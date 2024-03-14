import NavArea from './global_components/NavArea'
import BottomNavBar from './global_components/BottomNavBar'
import Main from './about_components/Main'
import React, { useEffect } from 'react';

const About = () => {


  useEffect(() => {
    document.title = 'About'; 
    return () => {
      document.title = 'Portfolio';
    };
  }, []);



  return (
    <>
    <NavArea
    pageTitle="about"
    />
    <Main/>
    <BottomNavBar/>
    </>
  )
}

export default About