import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 7,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    bgcolor: '#7380ec'
  },
}));

export default StyledBadge