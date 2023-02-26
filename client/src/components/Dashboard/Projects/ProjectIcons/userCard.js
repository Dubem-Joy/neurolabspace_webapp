import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { ProjectState } from '../../../../context/projectProvider';

const UserCard = ({ userAdd, userRemove, id, name, users }) => {
    const [assigned, setAssigned] = useState(false);
    const { loggedUser, projects } = ProjectState();

   

    const checkUser = (list, id) => {
        if (list) {
            let user = list.filter((item) => item._id === id)
            if (user.length === 0) {
                setAssigned(false)
            } else {
                setAssigned(true)
            }
        } else {
            setAssigned(false)
        }
    };

 

    // #calcuate assigned projects
    const [assignList, setAssignList] = useState([]);
    const calAssigned = () => {
        let assignLi = []
        projects.forEach((project) => {
            if (project.isCompleted === false && project.isCheckedOut === false) {
                let assign = (project.users.filter((item) => item._id === id)
                )
                if (assign.length > 0) {
                    assign.map((item) => [
                        assignLi.push(assign)
                    ])
                }
            } 
        });
        
        setAssignList(assignLi);
    };


    useEffect(() => {
        checkUser(users, id);
        calAssigned();
    }, [])
    
    return (
        <>
            <Avatar
                sx={{ width: 25, height: 25, bgcolor: '#ffffff', marginRight: '0.5rem', color: 'white' }}
                variant="circle"
            />
            <div className='usericons'>
                <h4 id={id} className={assigned ? 'warning' : ''} onClick={(e) => {
                    if (assigned) {
                        userRemove(e, loggedUser)
                        setAssigned(false)
                    } else {
                        userAdd(e, loggedUser)
                        setAssigned(true)
                    }
                }}> {name} </h4>
                <div>
                    
                </div>
                <h5 className="primary">{assignList.length} </h5>
            </div>
        </>
    );
};

export default UserCard;