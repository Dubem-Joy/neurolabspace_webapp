import React, {useState } from "react";
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import AddCardIcon from '@mui/icons-material/AddCard';
import Tooltip from '@mui/material/Tooltip';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { ProjectState } from "../../../../context/projectProvider";
import SimpleBackdrop from "../../../alerts/Backdrop";
import AlertSnack from "../../../alerts/Alert";

export default function Payment({ openDyDashSummary }) {
  const { loggedUser, setProjects, projectEdit } = ProjectState();
  const [name, setName] = useState(projectEdit.projectName);
  const [cost, setCost] = useState(parseInt(projectEdit.projectCost));
  const [paid, setPaid] = useState(parseInt(projectEdit.paidCost));
  const [bal, setBal] = useState(parseInt(projectEdit.balance));
  const [newPay, setNewPay] = useState('');

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

  // #get UI check event and send to backend
  const handleSubmit = async (user) => {
    
    try {
      
      const paidCost = parseInt(paid + parseInt(newPay));
      const balance = parseInt(bal - parseInt(newPay));

      setPaid(paid + parseInt(newPay));
      setBal(cost - parseInt(paid + parseInt(newPay)));
      setNewPay(0)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const projectId = projectEdit._id;
      handleBackdropToggle();
      await axios.put('/projects/payment',
        { projectId, paidCost, balance },
        config
      );
      
      const { data } = await axios.get('/projects', config);
      setProjects(data)
      setMessage('Payment updated');
      setSeverity('success');
      setView(true);
      handleBackdropClose();

      setTimeout(openDyDashSummary, 1500)

    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div className='dynamic'>
      <div className="payment">
        <div className="top">
          <div className="header">
            <div className="title">
              <AccountBalanceWalletIcon className="primary" />
              <h3 className="text-muted">{name}</h3>
            </div>
            <Tooltip title='close'>
              <CloseIcon className="icon primary" onClick={openDyDashSummary} />
            </Tooltip>
          </div>
          <div className="summary">
            <div className="item">
              <h2>{cost.toLocaleString('en-US')}</h2>
              <h5 className='warning'>total</h5>
            </div>
            <div className="item">
              <h2>{paid.toLocaleString('en-US')}</h2>
              <h5 className='success'>paid</h5>
            </div>
            <div className="item">
              <h2>{bal.toLocaleString('en-US')}</h2>
              <h5 className='danger'>Balance</h5>
            </div>
          </div>
        </div>
        <div className="input">
          <h4>update payment</h4>
          <div className="item">
            <TextField
              type='number'
              hiddenLabel
              id="filled-hidden-label-small"
              placeholder="enter amount"
              variant="filled"
              size="small"
              sx={{ width: '100%' }}
              value={newPay}
              onChange={(e) => {
                setNewPay(parseInt(e.target.value))
              }}
            />
            {paid === cost || newPay > bal ? <Tooltip
              title="add"
            >
              <AddCardIcon className="icon primary" onClick={() => {
                alert('invalid entry or payment cleared')
              }} />
            </Tooltip> : <Tooltip
              title="add"
            >
              <AddCardIcon className="icon primary" onClick={() => {
                  handleSubmit(loggedUser);
              }} />
            </Tooltip>}
            <AlertSnack view={view} handleClose={handleClose} message={message} severity={severity} />
            <SimpleBackdrop backdrop={backdrop} />
          </div>
        </div>
      </div>
    </div>
  );
};
