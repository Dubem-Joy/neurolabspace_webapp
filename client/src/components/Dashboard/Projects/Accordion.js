import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormGroup from '@mui/material/FormGroup';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import { green, } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddRemoveUsers from './ProjectIcons/AddRemoveUsers';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import TaskItem from './TaskItem';
import { ProjectState } from '../../../context/projectProvider';
import SimpleBackdrop from '../../alerts/Backdrop';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import moment from 'moment';

const SimpleAccordion = ({ project, color, adminAccordion, showAlert, openDynChat, openDynEditProject, openDynPayment, handleDelete }) => {
    const [panel, setPanel] = useState(false);
    const {loggedUser, setProjectEdit, setProjects, team, setSelectedChat } = ProjectState();
    const tp = project.TissueProcessing;
    const ihc = project.Immunohistochemistry;
    const photo = project.Photomicrography;
    const quant  = project.Quantification;
    const inter  = project.Interpretation;
    let todo = project.isTodo;
    let inProgress = project.isInProgress;
    let complete = project.isCompleted;
    let checkout = project.isCheckedOut;
    const [projectUsers, setProjectUsers] = useState(project.users);
    
    // #Backdrop
    const [backdrop, setBackdrop] = React.useState(false);
    const handleBackdropClose = () => {
        setBackdrop(false);
    };
    const handleBackdropToggle = () => {
        setBackdrop(!backdrop);
    };

    // #users selection
    const userAdd = async (e, user) => {

        try {
        
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            let userId = e.target.id
            let projectId = project._id
            let userList = team.filter((item) => item._id === userId)
            handleBackdropToggle();
            await axios.put('/api/projects/adduser', { projectId, userId }, config)
            if (projectUsers.length === 0) {
                setProjectUsers([userList[0]])
                checkAccess();
                handleBackdropClose();
            } else {
                projectUsers.map((userItem) => {
                    if (userItem._id !== userId) {
                        setProjectUsers([...projectUsers, userList[0]])
                        checkAccess();
                        handleBackdropClose();
                    } else {
                        console.log('user already added')
                    }
                })
            };
        } catch (error) {
        
        }
    };
    const userRemove = async (e, user) => {

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            let userId = e.target.id
            let projectId = project._id
            handleBackdropToggle();
            await axios.put('/api/projects/removeuser', { projectId, userId }, config);
            setProjectUsers(projectUsers.filter((item) => item._id !== userId));
            checkAccess();
            handleBackdropClose();
        } catch (error) {
            
        }
        
    };

    // #fetch project that should be editited
    const fetchCurrentProject = (item) => {
        setProjectEdit(item)
    };
    const openPanel = () => {
        setPanel(!panel)
    };


    const fetchProjects = async (user) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            handleBackdropToggle();
            const { data } = await axios.get('/api/projects', config);
            handleBackdropClose();
            setProjects(data);

        } catch (error) {
            console.log(error)
        }
    };

    
    // #switch sheck
    const switchCheck = (e) => {

        fetchProjects(loggedUser);

        tp["added"] = project.TissueProcessing.added
        ihc["added"] = project.Immunohistochemistry.added
        photo["added"] = project.Photomicrography.added
        quant["added"] = project.Quantification.added
        inter["added"] = project.Interpretation.added
        let taskName = e.target.id.toString();
        if (taskName === 'Tissue Processing') {
            tp["checked"] = !tp.checked
        } 
        if (taskName === 'Immunohistochemistry') {
            ihc["checked"] = !ihc.checked
        }
        if (taskName === 'Photomicrography') {
            photo["checked"] = !photo.checked
        }
        if (taskName === 'Quantification') {
            quant["checked"] = !quant.checked
        }
        if (taskName === 'Interpretation') {
            inter["checked"] = !inter.checked
        }

    };

    // #update project
    const updateProject = async (user) => {
        try {  
           
            if (ihc.checked === false && tp.checked === false && photo.checked === false && quant.checked === false && inter.checked === false) {
                todo = true
                inProgress = false
                complete = false
                checkout = false
            }
            if (ihc.checked === true || tp.checked === true ||  photo.checked === true || quant.checked === true || inter.checked === true) {
                todo = false
                inProgress = true
                complete = false
                checkout = false
            }
            if (ihc.added === ihc.checked && tp.added === tp.checked && photo.added ===  photo.checked && quant.added === quant.checked  && inter.added === inter.checked) {
                todo = false
                inProgress = false
                complete = true
                checkout = false
            }

            let projectId = project._id;
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            handleBackdropToggle();
            await axios.put('/api/projects/update',
                { projectId, tp, ihc, photo, quant, inter, todo, inProgress, complete, checkout },
                config
            );
            const { data } = await axios.get('/api/projects', config);
            handleBackdropClose();
            setProjects(data)

        } catch (error) {
            console.log(error)
        }
    };

    // #get UI check event and send to backend
  const checkProjectOut = async (user) => {
    
      try {
        const checkOut = true;
        const completed = false;
        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const projectId = project._id;
      handleBackdropToggle();
      await axios.put('/projects/checkout',
        { projectId, checkOut, completed },
        config
      );
      
      const { data } = await axios.get('/api/projects', config);
      setProjects(data)
      handleBackdropClose();

    } catch (error) {
      console.log(error)
    }
  };

    // #check project acessibility
    const [userAccess, setUserAccess] = useState(false);
    const checkAccess = () => {
        let list = projectUsers.filter((projectUser) => projectUser._id === loggedUser._id)
        if (list.length !== 0 || loggedUser.admin === true) {
                setUserAccess(true)
        } else {
            setUserAccess(false)
        } 
    }

    React.useEffect(() => {
        checkAccess();
    }, [projectUsers])

    // moment(message.createdAt).calendar()
    return (
        <div>
            <Accordion
                disabled={!userAccess}
                className='accordion'
                onClick={()=>showAlert(userAccess)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon className='icon' title='expand' />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <div className="projectitem">
                        <div
                            className={color}
                        >
                        </div>
                        <div className="right">
                            <div className="info">
                                <h3>{project.projectName}</h3>
                                {project.isCompleted === true && project.balance === 0 ? <h5 className='primary'>check project out</h5>
                                 : <h5>{moment(project.createdAt).calendar()}</h5> }
                            </div>
                            <div className="buttons">
                                
                            </div>
                        </div>
                    </div>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="just">
                        <div className="left">

                        </div>
                        <div className="right">
                            {project.isCompleted === true && project.balance === 0 && <ShoppingCartCheckoutIcon className='icon' onClick={() => {
                                checkProjectOut(loggedUser);
                            }} />}
                        </div>
                    </div>
                    
                    <FormGroup sx={{marginLeft:'0.8rem'}}>
                        {project.TissueProcessing.added && <TaskItem name={'Tissue Processing'} checked={tp.checked} updateProject={updateProject} switchCheck={switchCheck} fetchProjects={fetchProjects}/>}

                        {project.Immunohistochemistry.added && <TaskItem name={'Immunohistochemistry'} checked={ihc.checked} updateProject={updateProject} switchCheck={switchCheck} fetchProjects={fetchProjects}/>}

                        {project.Photomicrography.added && <TaskItem name={'Photomicrography'} checked={photo.checked} updateProject={updateProject} switchCheck={switchCheck} fetchProjects={fetchProjects}/>}

                        {project.Quantification.added && <TaskItem name={'Quantification'} checked={quant.checked} updateProject={updateProject} switchCheck={switchCheck} fetchProjects={fetchProjects}/>}

                        {project.Interpretation.added && <TaskItem name={'Interpretation'} checked={inter.checked} updateProject={updateProject} switchCheck={switchCheck} fetchProjects={fetchProjects}/>}
                    </FormGroup>
                    <div className="assign">
                        <div className="users">
                            <AvatarGroup max={4}>
                                {projectUsers.map((user) => {

                                    return (
                                     
                                        <Tooltip
                                            title={user.name}
                                            arrow
                                            key={user._id}
                                        >
                                            <Avatar
                                                sx={{ width: 25, height: 25, bgcolor: green[500], fontFamily: 'Montserrat', fontWeight: '600', fontSize: '0.65rem' }}
                                                variant="circle"
                                                className='icon'
                                            />
                                        </Tooltip>
                                    
                                    )
                                })}
                            </AvatarGroup>
                        </div>
                        <div className="chat-icon">
                            <Tooltip
                                title="Admin panel"
                                arrow
                            >
                                <AdminPanelSettingsIcon
                                    className='icon'
                                    onClick={() => {
                                        const user = JSON.parse(localStorage.getItem("userInfo"));
                                        if (user.admin === true) {
                                            openPanel()
                                        } else {
                                            adminAccordion();
                                        }
                                    }}
                                    sx={{ borderRadius: '50%', padding: '0.1rem', "&:hover": { padding: 0 } }}
                                />
                                
                            </Tooltip>
                            <Tooltip
                                title="Chat"
                                arrow
                            >
                                <MessageOutlinedIcon
                                    className='icon'
                                    sx={{ borderRadius: '50%', padding: '0.1rem', "&:hover": { padding: 0 } }}
                                    onClick={() => {
                                        openDynChat();
                                        setSelectedChat(project)
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={panel ? '' : 'hide'}>
                        <Divider />
                        <div className='admin-icons'>
                            <AddRemoveUsers users={projectUsers} userAdd={userAdd} userRemove={userRemove} />
                            <DriveFileRenameOutlineOutlinedIcon
                                className='icon'
                                sx={{ backgroundColor: "#7380ec", color: '#ffffff', borderRadius: '50%', padding: '0.2rem', "&:hover": { backgroundColor: '#ffffff', color: '#7380ec', padding: 0, } }}
                                onClick={() => {
                                    fetchCurrentProject(project);
                                    openDynEditProject();
                                }}
                            />
                            <Tooltip
                                title="Delete Project"
                                arrow
                        
                            >
                                <div>
                                    <DeleteOutlineOutlinedIcon
                                        className='icon'
                                        sx={{ backgroundColor: "#7380ec", color: '#ffffff', borderRadius: '50%', padding: '0.2rem', "&:hover": { backgroundColor: '#ffffff', color: '#7380ec', padding: 0, } }}
                                        onClick={() => handleDelete(loggedUser, project)}
                                        project={project}
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip
                                title="Payments"
                                arrow
                            >
                                <PaymentsIcon
                                    className='icon'
                                    sx={{ backgroundColor: "#7380ec", color: '#ffffff', borderRadius: '50%', padding: '0.2rem', "&:hover": { backgroundColor: '#ffffff', color: '#7380ec', padding: 0, } }}
                                    onClick={() => {
                                        fetchCurrentProject(project);

                                        openDynPayment();
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
            <SimpleBackdrop backdrop={backdrop} />
        </div>
    );
};


export default SimpleAccordion;