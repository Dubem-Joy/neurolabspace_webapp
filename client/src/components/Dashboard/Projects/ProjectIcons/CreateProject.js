import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Button from '@mui/material/Button';
import AlertSnack from '../../../alerts/Alert';
import { ProjectState } from '../../../../context/projectProvider';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import SimpleBackdrop from '../../../alerts/Backdrop';
// #socket io
import io from 'socket.io-client';
const ENDPOINT = "http://localhost:5000";
var socket;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

const CreateProject = ({openDyDashSummary}) => {
  const { loggedUser,  projects, setProjects } = ProjectState();
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0);
   const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);
  const [tp, setTp] = useState({'checked': false, 'added': false});
  const [ihc, setIhc] = useState({'checked': false, 'added': false});
  const [photo, setPhoto] = useState({'checked': false, 'added': false});
  const [quant, setQuant] = useState({'checked': false, 'added': false});
  const [inter, setInter] = useState({'checked': false, 'added': false});
  const [todo, setTodo] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [complete, setComplete] = useState(false);
  const [checkout, setCheckout] = useState(false);

  // #socket io
  const [ioConnect, setIoConnect] = useState(false);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', loggedUser)
    socket.on('connection', () => {
      setIoConnect(true)
    })
    
  }, []);

  // #snackalert
  const [view, setView] = useState(false);;
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
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

  // #create project
  const handleSubmit = async (user, projects) => {
    if (!name) {
      setView(true);
      setMessage('You need to input a project name')
      setSeverity('error')
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      handleBackdropToggle();
      
      const { data }  = await axios.post('/api/projects/project',
        {name, cost, tp, ihc, photo, quant, inter, paid, bal, todo, inProgress, complete, checkout, user },
        config
      );
      handleBackdropClose();
      // *socket
      socket.on("new project", (data));
      setProjects([data, ...projects]);
      
      setMessage('Project created');
      setSeverity('success');
      
      setView(true);
      discardChanges();

      openDyDashSummary();

    } catch (error) {
      setMessage(`${error}`);
      setSeverity('error');
      setView(true);
    }
  };

  // #discard inputs
  const discardChanges = () => {
    setName('')
    setCost(0)
    setTp({'checked': false, 'added': false})
    setIhc({'checked': false, 'added': false})
    setPhoto({'checked': false, 'added': false})
    setQuant({'checked': false, 'added': false});
    setInter({'checked': false, 'added': false});
  }

  useEffect(() => {
    socket.on("project received", (newProject) => {
      setProjects([newProject, ...projects])
    });

  });
  
  return (
    <div className='dynamic'>
      <div className="add-project">
        <div className="p-t">
          <h3 className='primary'>Add new project</h3>
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
              placeholder='project name e.g Dr Jon Doe_UNI'
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
              placeholder='cost (NGN)'
              onChange={(e) => {
                setCost(e.target.value);
                setBal(e.target.value);
              }}
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
                onChange={() => setTp({'checked': false, 'added': !tp.added})}
              />}/>
              <h3>Tissue processing</h3>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={ihc.added}
                onChange={() => setIhc({'checked': false, 'added': !ihc.added})}
              />} />
              <h3>Immunohistochemistry</h3>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={photo.added}
                onChange={() => setPhoto({'checked': false, 'added': !photo.added})}
              />} />
              <h3>Photomicrography</h3>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled'}}
                sx={{ margin: 0, padding: 0, }}
                checked={quant.added}
                onChange={() => setQuant({'checked': false, 'added': !quant.added})}
              />} />
              <h3>Quantification</h3>
            </div>
            <div className="taskitem">
              <FormControlLabel control={<Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ margin: 0, padding: 0, }}
                checked={inter.added}
                onChange={() => setInter({'checked': false, 'added': !inter.added})}
              />} />
              <h3>Interpretation</h3>
            </div>
          </div>
        </div>
        <div className="p-btns">
          <div className="save">
            <Button variant="contained" startIcon={<SaveIcon />} sx={{ height: 30, fontSize: 10, }}
              onClick={() => {
                handleSubmit(loggedUser, projects);
              }}
            >
              Save
            </Button>
            <AlertSnack view={view} handleClose={handleClose} message={message} severity={severity} />
            <SimpleBackdrop backdrop={backdrop} />
          </div>
          <div className="discard">
            <Button variant="contained" color='warning' startIcon={<RestartAltIcon />} sx={{ height: 30, fontSize: 10, marginLeft: '0.2rem' }}
            onClick={discardChanges} 
            >
              Discard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject