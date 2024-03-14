import NavArea from './global_components/NavArea'
import ProjectsCompo from './project_components/project/Projects'
import BottomNavBar from './global_components/BottomNavBar'
import React, { useEffect } from 'react';

const Project = () => {

  useEffect(() => {
    document.title = 'Projects'; 
    return () => {
      document.title = 'Portfolio';
    };
  }, []);

  return (
    <div>
      <NavArea
      pageTitle="projects"
      />
      <ProjectsCompo/>
      <BottomNavBar/>
    </div>
  )
}

export default Project