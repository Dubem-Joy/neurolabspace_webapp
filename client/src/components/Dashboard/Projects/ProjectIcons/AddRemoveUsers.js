import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import SimpleBackdrop from '../../../alerts/Backdrop';
import { ProjectState } from '../../../../context/projectProvider';
import UserCard from './userCard';


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
        fontSize: 15,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(0.5),
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

export default function AddRemoveUsers({ users, userAdd, userRemove}) {
    // #controls dialog box
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const { team } = ProjectState();


  return (
    <div className='add-remove-users'>
      <Tooltip
        title="Add/Remove Users"
        arrow
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        // variant="contained"
        onClick={handleClick}
      >
        <PersonAddAltIcon
          className='icon'
          sx={{ backgroundColor: "#7380ec", color: '#ffffff', borderRadius: '50%', padding: '0.2rem', "&:hover": { backgroundColor: '#ffffff', color: '#7380ec', padding: 0, } }}
        />
      </Tooltip>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        
        {team.map((teamMember) => {
          if (users.length === 0) {
            return (
              <div key={teamMember._id} >
                <MenuItem
                  ripple='true'
                  sx={{ fontFamily: 'Montserrat', width: 200 }}
                >
                  <UserCard id={teamMember._id} userRemove={userRemove} userAdd={userAdd} name={teamMember.name} assigned={true} />
                </MenuItem>
              </div>
            )
          }
        })}
        {team.map((teamMember) => {
          if (users.length !== 0) {
            return (
              <MenuItem
                ripple='true'
                sx={{ fontFamily: 'Montserrat', width: 200 }}
                key={teamMember._id}
              >
                <UserCard id={teamMember._id} userRemove={userRemove} userAdd={userAdd} name={teamMember.name} assigned={true} users={ users} teamMember={teamMember} />
              </MenuItem>
            )
          } else {
            return ''
          }
        }
        )}
      </StyledMenu>
    </div>
  );
};
