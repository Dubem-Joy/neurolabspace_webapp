import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import StyledBadge from './Badge';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { ProjectState } from '../../../context/projectProvider';


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

export default function Notifications() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { notification } = ProjectState();

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
        sx={{ height: 30, width: 40, bgcolor: '#FFFFFF', fontFamily: 'Montserrat', fontSize: '0.87rem', color: '#000000', padding: '0', "&:hover": { backgroundColor: "transparent", } }}
      >
        <Tooltip
          title="Notifications"
          arrow
        >
          
          <StyledBadge badgeContent={notification.length} color="primary">
            < NotificationsOutlinedIcon className='icon' />
          </StyledBadge>
           
        </Tooltip>
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
        {
          notification && notification.map((notify) => {
            return (<MenuItem
              onClick={handleClose}
              ripple='true'
              sx={{ fontFamily: 'Montserrat', fontSize: '0.8rem', color: '#000000', fontWeight: '500', width: 350 }}
              className="notify-item"
            >
                    
              <div>
                <h4> Mamus assigned you to new project </h4>
                <h5 className="text-muted">2 mins</h5>
              </div>
            </MenuItem>)
          })
        }
                
        
      </StyledMenu>
    </div>
  );
};
