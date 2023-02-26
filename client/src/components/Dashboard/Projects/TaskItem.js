import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ProjectState } from '../../../context/projectProvider';

function TaskItem({ name, checked, updateProject, switchCheck }) {
    // const [checkbox, setCheckbox] = useState(checked);
     const { loggedUser } = ProjectState();

    // #get UI check eveny and send to backend
    const handleChange = (e) => {
        switchCheck(e);
        updateProject(loggedUser);
    };

    return (
        <div className="taskitem">
            <FormControlLabel control={<Checkbox
                checked={checked}
                id={name}
                onClick={(e) => handleChange(e)}
                onChange={() => updateProject(loggedUser)}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }} />} />
            <h3>{name}</h3>
        </div>
    );
};

export default TaskItem