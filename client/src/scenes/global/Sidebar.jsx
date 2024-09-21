import { useEffect, useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import "react-pro-sidebar/dist/styles/StyledUl.d.ts";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { LockOpenOutlined } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box>
    <MenuItem
      component={<Link to={to}></Link>}
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}>
      <Typography>{title}</Typography>
    </MenuItem>
    </Box>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const dispatch = useDispatch(); // Get dispatch function from Redux
  const { user, token } = useSelector((state) => state.auth); 
  const isAdmin = user?.privilege == 'admin' ? true : false;
  

  return (
    <Box
      height="100%"
      sx={{
        "& .ps-sidebar-root": {
          border: "none",
          height: "100%"
        },
        "& .ps-sidebar-container": {
          backgroundColor: `${colors.primary[600]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .ps-menu-button:hover": {
          backgroundColor: `${colors.primary[400]} !important`,
        },
        ".ps-active .ps-menu-button": {
          backgroundColor: `${colors.primary[400]} !important`,
        },
        "& .ps-menuitem-root .ps-active": {
          color: `${colors.blueAccent[400]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                m="1rem 0 0 15px"
              >
                <Box textAlign="left">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography>
              </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed ? 
            <Box mt="3rem" height="130px" display="flex" flexDirection="column" justifyContent="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user?"
                  width="100px"
                  height="100px"
                  src={user?.avatar}
                  style={{ cursor: "pointer", borderRadius: "50%", transition: "all .3s ease" }}
                />
              </Box>
              
            </Box>
          : 
            <Box mt="3rem" height="130px" display="flex" flexDirection="column" justifyContent="center">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                alt="profile-user"
                width="50px"
                height="50px"
                src={user?.avatar}
                style={{ cursor: "pointer", borderRadius: "50%", transition: "all .3s ease" }}
              />
            </Box>
            </Box>
          }
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Users
            </Typography>
            {isAdmin && (
              <Item
                title="Add User"
                to="/form/user"
                icon={<PersonAddAltOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />)
            }
            <Item
              title="Manage Team"
              to="/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}> Pages </Typography>
            <Item
              title="New project"
              to="/form/project"
              icon={<LockOpenOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Open projects"
              to="/projects"
              icon={<LockOpenOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Closed projects"
              to="/form"
              icon={<LockOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/planning"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            { /*
           <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}> Charts </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
