import React, { useEffect } from 'react';
import Main from './home_components/Main'
import BottomNav from './home_components/BottomNav'
import CopyRight from './home_components/CopyRight'
import NavArea from './home_components/NavArea'


const Home = () => {

  useEffect(() => {
    document.title = 'Home'; 
    return () => {
      document.title = 'Portfolio';
    };
  }, []);

  return (
    <>
      <NavArea/>
      <Main />
      <BottomNav/>
      <CopyRight/>
    </>
  )
}

export default Home