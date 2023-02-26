import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import AlertSnack from '../../../alerts/Alert';
import { ProjectState } from '../../../../context/projectProvider';
import SimpleBackdrop from '../../../alerts/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { useHistory } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

const EditProject = ({openDyDashSummary}) => {
  const { loggedUser, setProjects, projectEdit, setProjectEdit } = ProjectState();
  const [name, setName] = useState(projectEdit.projectName);
  const [cost, setCost] = useState(parseInt(projectEdit.projectCost));
  const [paid, setPaid] = useState(parseInt(projectEdit.paidCost));
  const [tp, setTp] = useState(projectEdit.TissueProcessing);
  const [ihc, setIhc] = useState(projectEdit.Immunohistochemistry);
  const [photo, setPhoto] = useState(projectEdit.Photomicrography);
  const [quant, setQuant] = useState(projectEdit.Quantification);
  const [inter, setInter] = useState(projectEdit.Interpretation);
  const history = useHistory();

  // #snackalaert
  const [view, setView] = useState(false);;
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  // #close snack
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setView(!view);
  };

  // #Backdrop
  const [backdrop, setBackdrop] = React.useState(false);
  const handleBackdropClose = () => {
    setBackdrop(false);
  };
  const handleBackdropToggle = () => {
    setBackdrop(!backdrop);
  };


   // #switch sheck
  const switchCheck = (e) => {
    let taskName = e.target.id.toString();
    if (taskName === 'Tissue Processing') {
      tp["added"] = !tp.added
    }
    if (taskName === 'Immunohistochemistry') {
      ihc["added"] = !ihc.added
    }
    if (taskName === 'Photomicrography') {
      photo["added"] = !photo.added
    }
    if (taskName === 'Quantification') {
      quant["added"] = !quant.added
    }
    if (taskName === 'Interpretation') {
      inter["added"] = !inter.added
    }
  };

  // #get UI check eveny and send to backend
  const handleSubmit = async (user) => {
    try {
      const bal = parseInt(cost - paid);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const projectId = projectEdit._id;
      handleBackdropToggle();
      const data1 = await axios.put('/projects/edit',
        { projectId, name, cost, tp, ihc, photo, quant, inter, bal},
        config
      );
      const { data } = await axios.get('/projects', config);
      // document.location.reload()
      
      setProjects(data);
      
      setMessage('Project edited');
      setSeverity('success');
      setView(true);
      handleBackdropClose();

      setTimeout(openDyDashSummary, 2000)
    } catch (error) {
      setMessage(`${error}`);
      setSeverity('error');
      setView(true);
    }
  };
  
  return (
    <div className='dynamic'>
      <div className="add-project">
        <div className="p-t">
          <h3 className='primary'>Edit Project: <span className="text-muted">{projectEdit.projectName}</span></h3>
          <Tooltip title='close'>
              <CloseIcon className="icon primary" onClick={openDyDashSummary} />
            </Tooltip>
        </div>
        <div className="p-name">
          <h4>Project name</h4>
          <Item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 2, pr: 2, borderBottom: '2px solid', borderBottomColor: '#7380ec' }}>
            <InputBase
              sx={{ ml: 1, fontFamily: 'Montserrat', fontSize: '0.8rem', fontWeight: '500', width: '100%' }}
              inputProps={{ 'aria-label': 'first name' }}
              placeholder={projectEdit.projectName}
              onChange={(e) => setName(e.target.value)}
            />
          </Item>
        </div>
        <div className="p-cost">
          <h4>Project cost</h4>
          <Item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 2, pr: 2, borderBottom: '2px solid', borderBottomColor: '#7380ec' }}>
            <InputBase
              sx={{ ml: 1, fontFamily: 'Montserrat', fontSize: '0.8rem', fontWeight: '500', width: '100%' }}
              inputProps={{ 'aria-label': 'first name' }}
              type='number'
              placeholder={`${projectEdit.projectCost}`}
              onChange={(e) => setCost(e.target.value)}
            />
          </Item>
        </div>
        <div className="p-tasks">
          <h3>Project tasks</h3>
          <div className='checks'>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={tp.added}
                id='Tissue Processing'
                onChange={(e) => switchCheck(e)}
              />}/>
              <h4>Tissue processing</h4>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={ihc.added}
                id='Immunohistochemistry'
                onChange={(e) => switchCheck(e)}
              />} />
              <h4>Immunohistochemistry</h4>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={photo.added}
                id='Photomicrography'
                onChange={(e) => switchCheck(e)}
              />} />
              <h4>Photomicrography</h4>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled'}}
                sx={{ margin: 0, padding: 0, }}
                checked={quant.added}
                id='Quantification'
                onChange={(e) => {
                  switchCheck(e)
                }}
              />} />
              <h4>Quantification</h4>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={inter.added}
                id='Interpretation'
                onChange={(e) => switchCheck(e)}
              />} />
              <h4>Interpretation</h4>
            </div>
          </div>
        </div>
        <div className="p-btns">
          <div className="save">
          </div>
          <div className="discard">
            <Button variant="contained" startIcon={<SaveIcon />} sx={{ height: 30, fontSize: 10, }}
              onClick={() => {
                handleSubmit(loggedUser);
                
              }}
            >
              Save
            </Button>
            <AlertSnack view={view} handleClose={handleClose} message={message} severity={severity} />
            <SimpleBackdrop backdrop={backdrop} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject