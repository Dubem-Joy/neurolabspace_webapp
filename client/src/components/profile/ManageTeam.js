import React, { useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Avatar from '@mui/material/Avatar';
import { ProjectState } from "../../context/projectProvider";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import OutlinedInput from '@mui/material/OutlinedInput';
import AlertSnack from "../alerts/Alert";
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MailIcon from '@mui/icons-material/Mail';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

const ManageTeam = ({ openDyDashSummary }) => {
    const { team, setTeam, loggedUser } = ProjectState();
    const [userAdmin, setUserAdmin] = useState(false);
    const [dashTeam, setDashTeam] = useState(team);
    const [email, setEmail] = useState('');
    const [emailAdmin, setEmailAdmin] = useState(false)
    const [name, setName] = useState('');

    // #close snack
    const [view, setView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setView(!view);
    };

    const toggleAdmin = async (user, teamMember) => {
        try {
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const userId = teamMember._id;
            var name = teamMember.name;
            var role = teamMember.role;
            var admin = !teamMember.admin;
             
            const { data } = await axios.put('/api/users/profile',
                { userId, name, role, admin, },
                config
            );
            const updatedTeam = dashTeam.filter((item) => item._id !== userId)
            setDashTeam([...updatedTeam, data])

        } catch (error) {
            console.log(error)
        }
    };

    const authEmail = async (user) => {
        setLoading(true);
        if (!email || !name)  {
            setLoading(false);

            setMessage('Please enter email and name')
            setSeverity('error')
            setView(true);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
             
            
            const { data } = await axios.post('/api/users/authemail',
                { email, emailAdmin, name },
                config
            );
            setLoading(false);
            console.log(data)
            setMessage('Email authenticated successfully')
            setSeverity('success')
            setView(true);

        } catch (error) {
            console.log(error)
            setLoading(false);
            setMessage('Email authentication failed, please try again')
            setSeverity('error')
            setView(true);
        }
        
    };

    return (
        <div className="dynamic">
            <div className="team-title">
                <h3 className="primary">Team Info</h3>
                <Tooltip title='close'>
                    <CloseIcon className="icon primary" onClick={openDyDashSummary} />
                </Tooltip>
            </div>
            <Box sx={{ width: '100%', padding: '0 2rem' }}>
                <Stack spacing={0.5} >
                    <div className="team-list">

                        {dashTeam.map((teamMember) => {
                            if (teamMember._id !== loggedUser._id) {
                                return (
                                    <Item key={teamMember._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 2, pr: 2 }}>
                                        <Avatar
                                            sx={{ width: 50, height: 50, fontFamily: 'Montserrat', fontWeight: '600' }}
                                            variant="square"
                                        // src={user.pic}
                                        />
                                        <div className="team-name">
                                            <div >
                                                <h3>{teamMember.name}</h3>
                                            </div>
                                            <h5 className="primary">{teamMember.email}</h5>
                                            <div>
                                                <h5 >-- {teamMember.role} --</h5>
                                            </div>
                                        </div>
                                        <div>
                                            {teamMember.admin === true ? <AdminPanelSettingsIcon className='icon' sx={{ color: '#7380ec' }} onClick={() => {
                                                if (loggedUser.admin !== false) {
                                                    setUserAdmin(!teamMember.admin)
                                                    toggleAdmin(loggedUser, teamMember);
                                                } else {
                                                    setView(true);
                                                    setMessage('admin access required');
                                                    setSeverity('warning');
                                                }
                                            }} /> : <AdminPanelSettingsIcon className="icon" sx={{ color: '#acb1b7' }} onClick={() => {
                                                setUserAdmin(!teamMember.admin)
                                                if (loggedUser.admin === true) {
                                                        
                                                    toggleAdmin(loggedUser, teamMember);
                                                } else {
                                                    setView(true);
                                                    setMessage('admin access required');
                                                    setSeverity('warning');
                                                }
                                            }} />}
                                            {/* {loggedUser.admin === true ? <GroupRemoveIcon className="icon" sx={{ color: '#ff7782', marginLeft: '1rem' }} onClick={() => {
                                                if (loggedUser.admin === true) {
                                                    alert('user removed');
                                                } else {
                                                    setView(true);
                                                    setMessage('admin access required');
                                                    setSeverity('warning');
                                                }
                                            }} /> : <GroupRemoveIcon className="icon" sx={{ color: '#acb1b7', marginLeft: '1rem', }}
                                                onClick={() => {
                                                if (loggedUser.admin === true) {
                                                    alert('user removed');
                                                } else {
                                                    setView(true);
                                                    setMessage('admin access required');
                                                    setSeverity('warning');
                                                }
                                            }}  />}
                                             */}
                                        </div>
                                    </Item>
                                );
                            }
                        })}
                    </div>
                </Stack>
            </Box>
            <div className="auth-email">
                <div className="title">
                    <h3 className="primary">Authenticate new member</h3>
                </div>
                <div className="email">
                    <h4>Email address</h4>
                    <OutlinedInput
                        id="outlined-adornment-email"
                        type='email'
                        variant="outlined"
                        sx={{ width: '100%', marginTop: '0.3rem' }}
                        inputprops={{ sx: { backgroundColor: 'white', } }}
                        size="small"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="email">
                    <h4>Name</h4>
                    <OutlinedInput
                        id="outlined-adornment-email"
                        type='text'
                        variant="outlined"
                        sx={{ width: '100%', marginTop: '0.3rem' }}
                        inputprops={{ sx: { backgroundColor: 'white', } }}
                        size="small"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="admin">
                    <h4>make admin?</h4>
                    <FormControlLabel control={<Checkbox
                        checked={emailAdmin}
                        onClick={() => {
                            setEmailAdmin(!emailAdmin)
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx={{ margin: 0, padding: 0, }} />} />
                    
                </div>
                
                <div className="submit">
                    {loggedUser.admin ? <LoadingButton
                        className="submit-btn"
                        variant="contained"
                        onClick={() => {
                            authEmail(loggedUser);
                        }}
                        loading={loading}
                        inputprops={{ sx: { color: 'white' } }}
                    >
                        <MailIcon />
                    </LoadingButton> : <LoadingButton
                        className="submit-btn"
                        variant="contained"
                        onClick={() => {
                            setMessage('Admin access required')
                            setSeverity('warning')
                            setView(true);

                        }}

                        inputprops={{ sx: { color: 'white' } }}
                    >
                        <MailIcon />
                    </LoadingButton>}
                    
                </div>
            </div>
            <AlertSnack view={view} handleClose={handleClose} message={message} severity={severity} />
        </div>
    )
};

export default ManageTeam;