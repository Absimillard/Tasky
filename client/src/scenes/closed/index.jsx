import React from 'react'

function Closed() {const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const store = projectStore();
    const userAccess = "admin";
    const [projects, setProjects] = useState([]);
    const [workTeam, setWorkTeam] = useState([]);

    const fetchProjects = async () =>{
      const res = await axios.get('http://localhost:3000/projects');
      setProjects(res.data.projects);
    };
    useEffect(()=>{
      fetchProjects();
    },[]);
    
    console.log(projects)
    const Item = ({ to, title, leads, members, guests, createdAt, deadline, brief, submits, callback }) => {
        return (
          <Box component={Link} to={to}  
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"p="15px" m="25px"
          borderRadius="4px" sx={{backgroundColor:`${colors.primary[400]}`}}>
            <Box display="flex"
            flexDirection="row"
            justifyContent="start"
            flexWrap="wrap" maxWidth="200px"> 
                <Typography variant="h3" color={colors.greenAccent[500]} sx={{width:"100%"}}>{title}</Typography>
                {leads && leads.map((lead) => { return <Typography key={lead._id} variant="h5" color={colors.redAccent[300]} sx={{width:"100%"}}>{lead}</Typography>})} 
                {members && members.map((member) => { return <Typography key={member._id} variant="h5" color={colors.redAccent[500]} sx={{width:"100%"}}>{member}</Typography>})} 
                {guests && guests.map((guest) => { return <Typography key={guests.indexOf(guest)} variant="h5" color={colors.redAccent[700]} sx={{width:"100%"}}>{guest}</Typography>})} 
                <Typography justifySelf="flex-end" variant="h7" color={colors.greenAccent[800]}>{createdAt}</Typography>
            </Box>
            <Box><Typography variant="h5" color={colors.greenAccent[500]}>{deadline}</Typography></Box>
            <Box><Typography variant="h5" color={colors.greenAccent[500]}>{brief}</Typography></Box>
            <Box><Typography variant="h5" color={colors.greenAccent[500]}>{submits}</Typography></Box>
            <Box><Typography variant="h5" color={colors.greenAccent[500]}>{callback}</Typography></Box>
            {userAccess === 'admin' && <Box></Box>}
          </Box>
        );
      };
  return (<>
      <Header title="PROJECTS" subtitle="Manage your projects" />
      <AddButton title="ADD PROJECT" to="/form/project" icon={<AdminPanelSettingsOutlinedIcon />}/>
      <div>
        {projects && projects.map((project, index) => {
                const participants = project.participants;        
                const leads = [...participants].filter((user) => {return user.role === 'lead'});
                const members = [...participants].filter((user) => {return user.role === 'member'});
                const guests = ['guest1','guest2'];
                return  <Item key={index}
                              to="/projects/:id" 
                              title={project.title} 
                              leads={leads && leads.map((lead) => {return lead.role})} 
                              members={members && members.map((member) => {return member.role})} 
                              guests={guests} 
                              createdAt={project.createdAt} 
                              deadline={project.deadline} 
                              brief={project.brief} 
                              submits={project.submits.submitImage} 
                              callback={project.submits.callback} />
              })}
        
      </div>
    </>
  )
}

export default Closed