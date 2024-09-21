import { useState, useEffect } from 'react'
import { ColorModeContext, useMode } from './theme'
import { CssBaseline, ThemeProvider, Box } from "@mui/material"
import { Routes, Route, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from './store/slices/notifsSlice';
import Topbar from './scenes/global/Topbar'
import Sidebar from './scenes/global/Sidebar'
import 'react-pro-sidebar/dist/styles/StyledUl.d.ts'
import RequireAuth from './components/RequireAuth'
import Dashboard from './scenes/dashboard'
import Users from './scenes/users'
import Home from './scenes/home'
import Planning from './scenes/planning'
import UserForm from './scenes/form/user'
import Projects from './scenes/projects'
import ProjectForm from './scenes/form/project'
import Logout from './scenes/logout'
import Closed from './scenes/closed'
import User from './scenes/user'
import Project from './scenes/projects/project'
import Register from './scenes/form/register'
import moment from 'moment';
import 'moment/locale/fr';
import { connectToSocket, disconnectFromSocket } from './store/slices/socketSlice';
import { useFetchUsersQuery } from './store/slices/api/apiSlice';
import { setUsers } from './store/slices/usersSlice';

// import Contacts from './scenes/contacts'
// import Bar from './scenes/bar'
// import Pie from './scenes/pie'
// import Line from './scenes/line'
// import Geography from './scenes/geography'
// import FAQ from './scenes/faq'
function App() {
  const [theme, colorMode] = useMode();
  const { isLoading, isError, data, isSuccess } =  useFetchUsersQuery();
  const dispatch = useDispatch();
  const loading = false;
  const { user } = useSelector((state) => state.auth);
  moment.locale('fr');
  useEffect(() => {
      if (user === null) {
        dispatch(disconnectFromSocket());
        try { // Use the new hook here
        } catch (error) {
          console.log(error)
        }
      }
      if (user?.id) {
        dispatch(connectToSocket(user?.id));
      }
  }, [user, dispatch]);
  useEffect(() => {
    dispatch(setUsers(data?.users))
  }, [isSuccess]);

  if (loading) {
    return <div>Loading...</div>;
  }
const GlobalLayout = () => (<>
    <Box height="100vh" display="flex" width="100%" maxWidth="100vw">
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column" height="100%" width="100%">
        <Topbar />
        <Outlet />
      </Box>
    </Box>
  </>
);
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <main className="content">
                <Routes>
                  <Route path="/" element={<RequireAuth><GlobalLayout /></RequireAuth>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path='/users/:userId' element={<User />} />
                            {/*<Route path="/form/user" element={<UserForm />} /> */}
                            <Route path="/form/user" element={<UserForm/>} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:projectId" element={<Project />} />
                            <Route path="/closed" element={<Closed />} />
                            <Route path="/form/project" element={<ProjectForm />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/planning" element={<Planning />} />
                            { /*   <Route path="/faq" element={<FAQ />} /> */}
                  </Route>
                </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}

export default App
