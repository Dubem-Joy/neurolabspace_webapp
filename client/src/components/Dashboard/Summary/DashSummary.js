import React, { useEffect, useState } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ProjectState } from '../../../context/projectProvider';

const DashSummary = () => {
    const { loggedUser, projects } = ProjectState();

    // #calcuate assigned projects
    const [assignList, setAssignList] = useState([]);
    const [competeNo, setCompleteNo] = useState([]);
    const calAssigned = () => {
        let assignLi = []
        let completeLi = []
        projects.forEach((project) => {
            if (project.isCompleted === false && project.isCheckedOut === false) {
                let assign = (project.users.filter((item) => item._id === loggedUser._id)
                )
                if (assign.length > 0) {
                    assign.map((item) => [
                        assignLi.push(assign)
                    ])
                }
            } else {
                let assign = (project.users.filter((item) => item._id === loggedUser._id)
                )
                if (assign.length > 0) {
                    assign.map((item) => [
                        completeLi.push(assign)
                    ])
                }
            }
        });
        
        setAssignList(assignLi);
        setCompleteNo(completeLi);
    };

    // #calculate lab projects
    const [labProjects, setLabProjects] = useState([]);
    const calLabProjects = () => {
        let items = []
        projects.forEach((project) => {
            if (project.isCompleted === false && project.isCheckedOut === false) {
                items.push(project)
            }
        });
        setLabProjects(items);
    };

    // #calculate lab projects finace
    const [total, setTotal] = useState(0);
    const [paid, setPaid] = useState(0);
    const [bal, setBal] = useState(0);
    const projectFinance = () => {
        let t = 0
        let p = 0
        let b = 0
        projects.forEach((project) => {
            
            t = parseInt(project.projectCost) + t;
            p = parseInt(project.paidCost) + p;
            b = parseInt(project.balance) + b;
        });
        setTotal(t.toLocaleString('en-US'));
        setPaid(p.toLocaleString('en-US'));
        setBal(b.toLocaleString('en-US'));
    };


    useEffect(() => {
        calAssigned();
        calLabProjects();
        projectFinance();
    }, [projects])
    
    return (
        <div className='dynamic'>
            <div className="dash-summary">
                <div className="projects">
                    <div className="title">
                        <AccountTreeIcon className='primary'/>
                        <h4>Summary</h4>
                    </div>
                    <div className="stats">
                        <div className="item">
                            <h1>{labProjects.length}</h1>
                            <h5>lab ongoing projects</h5>
                        </div>
                        <div className="item">
                            <h1>{assignList.length}</h1>
                            <h5>your ongoing projects</h5>
                        </div>
                    </div>
                    <div className="details">
                        <h4 >Completed as of January 2023: <span className='b success'>{ competeNo.length}</span></h4>
                    </div>
                  
                </div>
                <div className="finance">
                    <div className="title">
                        <AttachMoneyIcon className='primary' />
                        <h4>Finance</h4>
                        <h5>(from Jan 2023)</h5>
                    </div>
                    {loggedUser.admin ? <div className="stats">
                        <div className="item">
                            <h3>{total}</h3>
                            <h5 className='warning'>total</h5>
                        </div>
                        <div className="item">
                            <h3>{paid}</h3>
                            <h5 className='success'>paid</h5>
                        </div>
                        <div className="item">
                            <h3>{bal}</h3>
                            <h5 className='danger'>Balance</h5>
                        </div>
                    </div> : <h4 className='warning'>admin access is required</h4>}
                </div>
            </div>
        </div>
    );
};

export default DashSummary