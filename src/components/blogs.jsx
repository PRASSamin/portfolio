import NavArea from './global_components/NavArea'
import BottomNavBar from './global_components/BottomNavBar'
import Blog from './blog_components/blog/Blog'
import React, { useEffect } from 'react';

const Blogs = () => {

  useEffect(() => {
    document.title = 'Blogs'; 
    return () => {
      document.title = 'Portfolio';
    };
  }, []);


  return (
    <>
    <NavArea
    pageTitle="blogs"
    />
    <Blog/>
    <BottomNavBar/>
    </>
  )
}

export default Blogs