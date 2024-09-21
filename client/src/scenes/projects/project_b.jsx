import React, { useEffect, useState } from 'react';
import Project from '../../components/Project'; 
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFetchProjectsQuery } from '../../store/slices/api/apiSlice';
import { fetchProjects } from '../../store/slices/projects/listSlice';

const ProjectList = ({ userInfo }) => {
  const dispatch = useDispatch();
  const { isLoading, isError, data, isSuccess } = useFetchProjectsQuery();
  const { currents } = useSelector((state) => state.projects.list); 
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchProjects(data?.projects))
  }, [data]);
  return (
    <div>
      {currents?.map((project, index) => {
        const isParticipant = project.participants.some(participant => participant?._id._id === user._id);
        return (
          <div key={index}>
            {isParticipant ? (
              <Link style={{ textDecoration: 'inherit', color:'inherit'}} to={`/projects/${project?._id}`}>
                <Project project={project} />
              </Link>
            ) : (
              <Project project={project} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList;
