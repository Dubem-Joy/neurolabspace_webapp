import React, { useEffect, useState } from 'react';

const ProjectItem = ({ project }) => {
    const [admins, setAdmins] = useState(project.projectAdmin);
    const [color, setColor] = useState('');

    const findColor = () => {
        if (project.isTodo === true) setColor('danger');
        if (project.isInProgress === true)  setColor('warning');
        if (project.isCompleted === true) setColor('success');
       if (project.isCheckedOut === true) setColor('primary');
        console.log(color)
    }

    useEffect(() => {
        findColor();
    }, [project])
  
    return (
        <li className={`table-row`}>
            <div className="col col-1">
                <h5>{project.projectName}</h5>
                <h5 className='text-muted'>created by: {admins.map((admin) => <span key={admin._id}>{admin.name.split(" ", 1)}</span>)}</h5>
            </div>
            <div className="col col-2">
                <h5>Cost: <span className='text-muted'>{project.projectCost}</span></h5>
                <h5>Paid: <span className='text-muted'>{project.paidCost}</span></h5>
                <h5>Bal: <span className='text-muted'>{project.balance}</span></h5>
            </div>
            <div className={`col col-3 ${color}`}>
                <h5>
                    {project.isTodo ? 'Todo' : project.isInProgress ? 'In progress' : project.isCompleted ? 'Completed' : 'Checked out'}
                </h5>
                <h5>Created: <span className='text-muted'>{new Date(project.createdAt).toLocaleDateString()}</span></h5>
            </div>
            <div className="col col-4">
                {project.users.map((user) => {
                    if (user) {
                        return <h5 key={user._id}>{user.name}</h5>
                    } else {
                        return <h5>no user assigned</h5>
                    }
                })}
            </div>
        </li>
    );
};

export default ProjectItem;