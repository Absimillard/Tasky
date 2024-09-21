import React from 'react'
import ProjectList from './project_b';
import { useSelector } from 'react-redux';
function Projects() {
  const { user } = useSelector((state) => state.auth);
  return (<>
  <ProjectList userInfo={user}/>
    </>
  )
}

export default Projects