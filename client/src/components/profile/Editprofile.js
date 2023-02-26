import React, { useEffect, useState } from "react";
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import InputBase from '@mui/material/InputBase';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AlertSnack from "../alerts/Alert";
import SimpleBackdrop from "../alerts/Backdrop";
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

// #contexts
import { ProjectState } from "../../context/projectProvider";



const Editprofile = ({openDyDashSummary}) => {
    const { loggedUser, setLoggedUser, projects } = ProjectState();
    const [firstName, setFirstName] = useState((loggedUser.name.split(" ", 1)));
    const [role, setRole] = useState(loggedUser.role);
    const [lastName, setLastname] = useState((loggedUser.name.split(" ").splice(-1)));



    // #snackalaert
    const [view, setView] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
  // #close snack
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setView(!view);
    };

    // #Backdrop
    const [backdrop, setBackdrop] = React.useState(false);
    const handleBackdropClose = () => {
        setBackdrop(false);
    };
    const handleBackdropToggle = () => {
        setBackdrop(!backdrop);
    };

    // #get UI check eveny and send to backend
    const handleSubmit = async (user) => {
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const userId = user._id;
            handleBackdropToggle();

            var name = firstName + ' ' + lastName;
            const admin = user.admin;
            const { data }  = await axios.put('/api/users/profile',
                { userId, name, role, admin, },
                config
            );
            console.log(data)
            handleBackdropClose();
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoggedUser(data)
      
            setMessage('Profiled edited');
            setSeverity('success');
            setView(true);

            openDyDashSummary()

        } catch (error) {
            setMessage(`${error}`);
            setSeverity('error');
            setView(true);
        }
    };


    // #calcuate assigned projects
    const [assignList, setAssignList] = useState([]);
    const calAssigned = () => {
        let assignLi = []
        projects.forEach((project) => {
            let assign = (project.users.filter((item) => item._id === loggedUser._id)
            )
            if (assign.length > 0) {
                assign.map((item) => [
                    assignLi.push(assign)
                ])
            }
            
        });
        setAssignList(assignLi);
    };
    
    useEffect(() => {
        calAssigned();
    }, [])

    return (
        <div className="dynamic">
            <div className="edit-p">
                <div className="title">
                    <h3 className="primary">Edit profile</h3>
                    <Tooltip title='close'>
                        <CloseIcon className="icon primary" onClick={openDyDashSummary} />
                    </Tooltip>
                </div>
                <div className="info">
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', borderBottom: '2px solid', borderBottomColor: '#7380ec' }}
                    >
                        <InputBase
                            sx={{ ml: 1, fontFamily: 'Montserrat', fontSize: '0.8rem', fontWeight: '500' }}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            inputProps={{ 'aria-label': 'first name' }}
                        />
                    </Paper>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', marginTop: '0.4rem', borderBottom: '2px solid', borderBottomColor: '#7380ec' }}
                    >
                        <InputBase
                            sx={{ ml: 1, fontFamily: 'Montserrat', fontSize: '0.8rem', fontWeight: '500' }}
                            id="outlined-uncontrolled"
                            label="Uncontrolled"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                            inputProps={{ 'aria-label': 'lastName' }}
                        />
                    </Paper>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', marginTop: '0.4rem', borderBottom: '2px solid', borderBottomColor: '#7380ec' }}
                    >
                        <InputBase
                            sx={{ ml: 1, fontFamily: 'Montserrat', fontSize: '0.8rem', fontWeight: '500' }}
                            id="outlined-uncontrolled"
                            label="Uncontrolled"
                            defaultValue={role}
                            onChange={(e) => setRole(e.target.value)}
                            inputProps={{ 'aria-label': 'role' }}
                        />
                    </Paper>
                    <div className="save">
                        <Button variant="contained" startIcon={<SaveIcon />} sx={{ height: 30, fontSize: 10, marginTop:'1rem' }}
                            onClick={() => {
                                handleSubmit(loggedUser);
                                // openDyDashSummary();
                            }}
                        >
                            Save
                        </Button>
                        <AlertSnack view={view} handleClose={handleClose} message={message} severity={severity} />
                        <SimpleBackdrop backdrop={backdrop} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editprofile 