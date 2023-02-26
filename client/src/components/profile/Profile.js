import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GroupIcon from '@mui/icons-material/Group';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import { useHistory } from 'react-router-dom';
import { ProjectState } from '../../context/projectProvider';
import axios from 'axios';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '2px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function ProfileMenu({user, openDynProfile, openDynTeam, openDynReport}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const history = useHistory();

  const { setTeam, loggedUser } = ProjectState();

    // #Get team from server
  const fetchTeam = async (user) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get('/api/users/allusers', config);
      setTeam(data)
    } catch (error) {
      console.log(error)
    }
  };

  // #logout 
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/')
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon className='icon' />}
        sx={{ height: 15, bgcolor: '#FFFFFF', fontFamily: 'Montserrat', fontSize: '0.87rem', color: '#000000', padding: '0', "&:hover": { backgroundColor: "transparent", } }}
      >
        <h3>{user.name}</h3>
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >

        <MenuItem
          ripple='true'
          sx={{ fontFamily: 'Montserrat', fontSize: '0.8rem', color: '#000000', fontWeight: '500' }}
          onClick={() => {
            openDynProfile();
            handleClose();
          }}
        >
          <EditIcon />
          Edit Profile
        </MenuItem>

        <MenuItem
          ripple='true'
          sx={{ fontFamily: 'Montserrat', fontSize: '0.8rem', color: '#000000', fontWeight: '500' }}
          onClick={() => {
            fetchTeam(loggedUser);
            openDynTeam();
            handleClose();
          }}
        >
          <GroupIcon />
          Team
        </MenuItem>
        <MenuItem
          ripple='true'
          sx={{ fontFamily: 'Montserrat', fontSize: '0.8rem', color: '#000000', fontWeight: '500' }}
            onClick={() => {
            openDynReport();
            handleClose();
          }}
        >
          <SummarizeRoundedIcon />
          Generate report
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          ripple='true'
          sx={{ fontFamily: 'Montserrat', fontSize: '0.8rem', color: '#000000', fontWeight: '500' }}
          onClick={logoutHandler}
        >
          <LogoutOutlinedIcon />
          Logout
        </MenuItem>
        
      </StyledMenu>
    </div>
  );
};


