import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from "axios";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from '@fullcalendar/moment';
import listPlugin from "@fullcalendar/list";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

function Planning() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentsEvents, setCurrentsEvents] = useState([]);

    const fetchEvents = async() => {
      try {
        const res = await axios.get('/projects');
        const projects = res.data.projects;

        // Convert project data to event format expected by FullCalendar
        const formattedEvents = projects.map(project => ({
          title: project.title,
          start: project.createdAt, // Use creation date as event start
          end: project.deadline, // Use deadline as event end
          extendedProps: {
            // Additional properties to be passed to event content renderer
            projectId: project._id // Optionally pass project ID for further customization
          }
        }));
        setCurrentsEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    useEffect(() => {
     console.log(currentsEvents);
    }, [currentsEvents]);
    useEffect(() => {
      fetchEvents();
    }, []);

    const renderEventContent = (eventInfo) => {
      const { event } = eventInfo;
      return (
        <>
          <div>{event.title}</div> {/* Line representing project duration */}
        </>
      );
    };
  
    return (
      <Box p={10} height='100%'>
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin, momentPlugin, timeGridPlugin ]}
          initialView="dayGridMonth"
          events={currentsEvents}
          eventContent={renderEventContent}
          height='100%'
          headerToolbar={{
            left: 'prev,next today', // Left side of the toolbar
            center: 'title', // Center of the toolbar
            right: 'dayGridMonth,timeGridWeek' // Right side of the toolbar
          }}
        />
      </Box>)
}

export default Planning