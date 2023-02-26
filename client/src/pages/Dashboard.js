import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
// #componnents
import ProjectBoard from './ProjectBoard';
import ProfileMenu from '../components/profile/Profile';
import Notifications from '../components/Dashboard/Notification/NotificationDiaolog';
import Chat from '../components/Chat/Chat';
import DashSummary from '../components/Dashboard/Summary/DashSummary';
import Payment from '../components/Dashboard/Projects/ProjectIcons/Payment';

// #Material UI
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
// import { green, } from '@mui/material/colors';
import Divider from '@mui/material/Divider';

// #contexts
import { ProjectState } from '../context/projectProvider';
import Editprofile from '../components/profile/Editprofile';
import CreateProject from '../components/Dashboard/Projects/ProjectIcons/CreateProject';
import EditProject from '../components/Dashboard/Projects/ProjectIcons/EditProject';
import ManageTeam from '../components/profile/ManageTeam';
import GenerateReport from '../components/profile/Report/GenerateReport';
import SimpleBackdrop from '../components/alerts/Backdrop';

// #socket io
import io from 'socket.io-client';
const ENDPOINT = "http://localhost:5000";
var socket, selectedProjectCompare;


const Dashboard = () => {
    const { loggedUser, setLoggedUser, projects, setProjects, setTeam, notification } = ProjectState();
     // #Backdrop
    const [backdrop, setBackdrop] = useState(false);
    const handleBackdropClose = () => {
        setBackdrop(false);
    };
    const handleBackdropToggle = () => {
        setBackdrop(!backdrop);
    };
    
   
  
    // #Left bar toggle
    const [dynProfile, setDynprofile] = useState(false);
    const [dynTeam, setDynteam] = useState(false);
    const [dynReport, setDynreport] = useState(false);
    const [dynChat, setDynchat] = useState(false);
    const [dynAddProject, setDynAddproject] = useState(false);
    const [dynEditProject, setDynEditproject] = useState(false);
    const [dyDashSummary, setDyDashSummary] = useState(true);
    const [dyPayment, setDyPayment] = useState(false);
    const openDynProfile = () => {
        setDynAddproject(false);
        setDynchat(false);
        setDynEditproject(false);
        setDynreport(false);
        setDynteam(false);
        setDyDashSummary(false);
        setDyPayment(false);

        setDynprofile(true);
    };
    const openDynTeam = () => {
        setDynAddproject(false);
        setDynchat(false);
        setDynEditproject(false);
        setDynreport(false);
        setDynprofile(false);
        setDyDashSummary(false);
        setDyPayment(false);
        
        setDynteam(true);
    };
    const openDynReport = () => {
        setDynAddproject(false);
        setDynchat(false);
        setDynEditproject(false);
        setDynteam(false);
        setDynprofile(false);
        setDyDashSummary(false);
        setDyPayment(false);
        
        setDynreport(true);
    };
    const openDynChat = () => {
        setDynAddproject(false);
        setDynreport(false);
        setDynEditproject(false);
        setDynteam(false);
        setDynprofile(false);
        setDyDashSummary(false);
        setDyPayment(false);
        
        setDynchat(true);
    }
    const openDynAddProject = () => {
        setDynchat(false);
        setDynreport(false);
        setDynEditproject(false);
        setDynteam(false);
        setDynprofile(false);
        setDyDashSummary(false);
        setDyPayment(false);
        
        setDynAddproject(true);
    }
    const openDynEditProject = () => {
        setDynchat(false);
        setDynreport(false);
        setDynAddproject(false);
        setDynteam(false);
        setDynprofile(false);
        setDyDashSummary(false);
        setDyPayment(false);
        
        setDynEditproject(true);
    }
    const openDynPayment = () => {
        setDynchat(false);
        setDynreport(false);
        setDynAddproject(false);
        setDynteam(false);
        setDynprofile(false);
        setDyDashSummary(false);
        setDynEditproject(false);

        setDyPayment(true);
    }
    const openDyDashSummary = () => {
        setDynchat(false);
        setDynreport(false);
        setDynAddproject(false);
        setDynteam(false);
        setDynprofile(false);
        setDyPayment(false);
        setDynEditproject(false);

        setDyDashSummary(true);
    }
     
    // #Get team from server
    const fetchTeam = async (user) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get('/users/allusers', config);
            setTeam(data)
        } catch (error) {
            console.log(error)
        }
    };
    
    // #Get projects from server
    const fetchProjects = async (user) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            handleBackdropToggle();
            const { data } = await axios.get('/projects', config);
            handleBackdropClose();
            setProjects(data);

            // *socket io
            data.map((item) => {
                socket.emit('assign project', item._id);
            })
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        setLoggedUser(user)
        fetchTeam(user);
        fetchProjects(user);
    }, [])

    // #socket io
    const [ioConnect, setIoConnect] = useState(false);
     useEffect(() => {
         socket = io(ENDPOINT);
         socket.emit('setup', loggedUser)
         socket.on('connection', () => {
             setIoConnect(true)
         })
    }, [])

    return (
        <Container maxWidth="xl">
            <div className="home">
                <div className="rightbar">
                    <div className="user">
                        <div className="notification">
                            <Notifications />
                        </div>
                        <div className="profile icon">
                            <Avatar
                                sx={{ width: 45, height: 45, bgcolor: '#7380ec', fontFamily: 'Montserrat', fontWeight: '600' }}
                                variant="square"
                                src={loggedUser.pic}
                            />
                            <div className="name">
                                {loggedUser && <ProfileMenu user={ loggedUser } openDynProfile={openDynProfile} openDynTeam={openDynTeam} openDynReport={openDynReport} />}
                                <h5 className="text-muted">{loggedUser.role}</h5>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className="right-box">
                        {dyDashSummary && <DashSummary/>}
                        {dynChat && <Chat openDyDashSummary={ openDyDashSummary} />}
                        {dynProfile && <Editprofile openDyDashSummary={ openDyDashSummary} />}
                        {dynTeam && <ManageTeam openDyDashSummary={openDyDashSummary} />}
                        {dynReport && <GenerateReport openDyDashSummary={ openDyDashSummary} />}
                        {dynAddProject && <CreateProject  openDyDashSummary={ openDyDashSummary }/>}
                        {dynEditProject && <EditProject openDyDashSummary={ openDyDashSummary } />}
                        {dyPayment && <Payment openDyDashSummary={ openDyDashSummary} />}
                    </div>
                    
                </div>

                <div className="main">
                    <ProjectBoard openDynChat={openDynChat} openDynAddProject={openDynAddProject} openDynEditProject={openDynEditProject} fetchProjects={fetchProjects} openDynPayment={ openDynPayment} projects={projects} />
                    <SimpleBackdrop backdrop={backdrop} openDyDashSummary={ openDyDashSummary} />
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;





