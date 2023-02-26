import React, {useEffect, useState} from 'react';
import moment from 'moment';
import axios from 'axios';

// #Components
import SimpleAccordion from '../components/Dashboard/Projects/Accordion';
import AlertSnack from '../components/alerts/Alert';
import SimpleBackdrop from '../components/alerts/Backdrop';

// #Material UI
import CopyrightIcon from '@mui/icons-material/Copyright';
import LowPriorityOutlinedIcon from '@mui/icons-material/LowPriorityOutlined';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';

// #images
import logo from '../components/imgs/logo.png'

// #contexts
import { ProjectState } from '../context/projectProvider';


const ProjectBoard = ({ openDynChat, openDynAddProject,  openDynEditProject, openDynPayment, openDyDashSummary, projects }) => {
    const [view, setView] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const [admin, setAdmin] = useState(true);
    const { loggedUser, setProjects } = ProjectState();

    // #Greeting
    const generateGreetings = () => {
        var currentHour = moment().format("HH");

        if (currentHour >= 3 && currentHour < 12) {
            return "Morning";
        } else if (currentHour >= 12 && currentHour < 15) {
            return "Afternoon";
        } else if (currentHour >= 15 && currentHour < 20) {
            return "Evening";
        } else if (currentHour >= 20 && currentHour < 3) {
            return "Good Night";
        } else {
            return "Hello"
        }
    };

    // #close snack
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setView(!view);
    };
    
    const showAlert = (admin) => {
        if (admin === false) {
            setView(true);
            setMessage('You have no access: you are not assigned to this project')
            setSeverity('warning')
        }
        return
    };
    const addProject = () => {
        if (admin === false) {
            setView(true);
            setMessage('You have no access: you are not an admin')
            setSeverity('warning')

            return false;
        } else {
            return true;
        }
    };

    const adminAccordion = () => {
        setMessage('You do not have admin acess')
        setSeverity('warning')
        setView(true)
    };

    // #Backdrop
    const [backdrop, setBackdrop] = React.useState(false);
    const handleBackdropClose = () => {
        setBackdrop(false);
    };
    const handleBackdropToggle = () => {
        setBackdrop(!backdrop);
    };

    const handleDelete = async (user, project) => {

        const projectId = project._id
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            handleBackdropToggle();
            await axios.put('/projects/delete',
                { projectId },
                config
            );

            const { data } = await axios.get('/projects', config);
            handleBackdropClose();
            setProjects(data);
            
            
            setMessage('Project deleted');
            setSeverity('success');
            setView(true);


        } catch (error) {
            setMessage(`${error.response.data.message}: check interet connection`);
            setSeverity('error');
            setView(true);
        }
    };


    return (
        <div className='dashboard'>
            <div className="head">
                <div className='nothing'>
                    <Avatar
                        sx={{ bgcolor: '#7380ec' }}
                    >
                        <AddIcon
                            sx={{ cursor: 'pointer' }}
                            disabled={loggedUser.admin ? false : true}
                            onClick={() => {
                                addProject();
                                if (loggedUser.admin === true) {
                                    openDynAddProject();
                                } else {
                                    setMessage('You do not have admin acess')
                                    setSeverity('warning')
                                    setView(true)
                                }
                            }}
                        />
                    </Avatar>
                    <SimpleBackdrop backdrop={backdrop} />
                </div>
                <div className='greeting'>
                    <h2 className='b'>{generateGreetings()}, {loggedUser.name}</h2>
                    <h3>{moment().format('dddd, MMMM Do YYYY')}</h3>
                </div>
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
            </div>
            <div className="projects">
                <div className="todo">
                    <div className="header">
                        <LowPriorityOutlinedIcon sx={{ color: '#ff7782', cursor: 'pointer' }} />
                        <h3>Todo</h3>
                    </div>
                    {projects &&
                        <div className="projectitems">
                            {projects.map((project) => {
                                if (project.isTodo==true) {
                                    return <SimpleAccordion key={project._id} project={project} color={'todo-color'} admin={admin} showAlert={showAlert} openDynChat={openDynChat} openDynEditProject={openDynEditProject} openDynPayment={openDynPayment} handleDelete={handleDelete} openDyDashSummary={openDyDashSummary} adminAccordion={ adminAccordion} />
                                } else {
                                    return ''
                                }
                            })}
                        </div> 
                    }
                </div>
                <div className="in-progress">
                    <div className="header">
                        <RotateLeftOutlinedIcon sx={{ color: '#ffbb55', cursor: 'pointer' }} />
                        <h3>In progress</h3>
                    </div>
                    {projects &&
                        <div className="projectitems">
                            {projects.map((project) => {
                                if (project.isInProgress==true) {
                                    return <SimpleAccordion key={project._id} project={project} color={'inprogress-color'} admin={admin} showAlert={showAlert} openDynChat={openDynChat} openDynEditProject={openDynEditProject} openDynPayment={ openDynPayment} handleDelete={handleDelete} openDyDashSummary={openDyDashSummary} adminAccordion={adminAccordion}/>
                                } else {
                                    return ''
                                }
                            })}
                        </div>
                    }
                </div>
                <div className="completed">
                    <div className="header">
                        <FactCheckOutlinedIcon sx={{ color: '#41f1b6', cursor: 'pointer' }} />
                        <h3>Completed</h3>
                    </div>
                    {projects &&
                        <div className="projectitems">
                            {projects.map((project) => {
                                if (project.isCompleted==true && project.balance > 0) {
                                    return <SimpleAccordion key={project._id} project={project} color={'completed-color'} admin={admin} showAlert={showAlert} openDynChat={openDynChat} openDynEditProject={openDynEditProject} openDynPayment={ openDynPayment} handleDelete={handleDelete} openDyDashSummary={openDyDashSummary} adminAccordion={adminAccordion}/>
                                } 
                                if (project.isCompleted == true && project.balance === 0) {
                                    return <SimpleAccordion key={project._id} project={project} color={'check-color'} admin={admin} showAlert={showAlert} openDynChat={openDynChat} openDynEditProject={openDynEditProject} openDynPayment={ openDynPayment} handleDelete={handleDelete} openDyDashSummary={openDyDashSummary} adminAccordion={adminAccordion}/>
                                }
                            })}
                        </div>
                    }
                </div>
            </div>
            <div className="footer primary">
                <CopyrightIcon sx={{ width: 12 }}  />
                <h5 >2023 Labspce. The Neuro-Lab</h5>
            </div>  
            <AlertSnack view={view} handleClose={handleClose} message={message} severity={severity} />
        </div>
    );
};

export default ProjectBoard