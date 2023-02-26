import React, { useState } from 'react';
import { ProjectState } from '../../../context/projectProvider';
import ProjectItem from './projectItem';
import Button from '@mui/material/Button';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { jsPDF } from "jspdf";
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

const GenerateReport = ({openDyDashSummary}) => {
  const { projects } = ProjectState();
  const [loadedProjects, setLoadedProjects] = useState(projects)
  const [date_1, setDate_1] = useState('');
  const [date_2, setDate_2] = useState('');

  // #search projects by date added
  const handleSearch = (date_1, date_2, projectList) => {
    let startDate = new Date(date_1).getTime();
    let endDate = new Date(date_2).getTime();
    let items = [];

    projectList.forEach((project) => {
      let projectDate = new Date(project.createdAt).getTime();
      if (projectDate >= startDate && projectDate <= endDate) {
        items.push(project);
      }
    });
    console.log(loadedProjects)
    setLoadedProjects(items)

    console.log(loadedProjects)
    
  };
  const resetSearch = (projects) => {
    setLoadedProjects(projects)
  }
  // #generate pdf
  const createPDF = async () => {
    const pdf = new jsPDF("portrait", "pt", "a4");
    const data = await document.querySelector("#pdf");
    pdf.html(data).then(() => {
      pdf.save("projects.pdf");
    });
  };


  return (
    <>
      <div className="gen-title">
        <h3 className="primary">Project reports</h3>
        <Tooltip title='close'>
          <CloseIcon className="icon primary" onClick={openDyDashSummary} />
        </Tooltip>
      </div>
      <div className="generate">
        <div className="header">
          <div className="left">
            <h3>From:</h3>
            <input type="date" name="from" id="from" onChange={(e) => {
              setDate_1(e.target.value)
            }} />
          </div>
          <div className="right">
            <h3>To:</h3>
            <input type="date" name="to" id="to" onChange={(e) => setDate_2(e.target.value)} />
          </div>
        </div>
        <div className="buttons">
          <Button variant="outlined" sx={{ height: 30, fontSize: 10 }}
              onClick={() => handleSearch(date_1, date_2, projects)}
            >
              <h5>Get selected</h5>
            </Button>
            <Button variant="outlined" sx={{ height: 30, fontSize: 10 }}
              onClick={() => resetSearch(projects)}
            >
              <h5>Get all</h5>
            </Button>
            <Button variant="outlined" sx={{ height: 30, fontSize: 10 }}
              onClick={createPDF} >
              <PictureAsPdfIcon />
            </Button>
        </div>

        <div className="report" id="pdf">
          <h3>{date_1 && date_2 ? `Projects: ${new Date(date_1).toDateString()} - ${date_2 && new Date(date_2).toDateString()}`: 'All projects'}</h3>
          <ul className="responsive-table">
            <li className="table-header">
              <div className="col col-1">
                <h4>id</h4>
              </div>
              <div className="col col-2">
                <h4>Finance</h4>
              </div>
              <div className="col col-3">
                <h4>Status</h4>
              </div>
              <div className="col col-4">
                <h4>users</h4>
              </div>
            </li>
            <div className="log">
              {loadedProjects.map((project) => <ProjectItem project={project} key={project._id} />)}
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default GenerateReport