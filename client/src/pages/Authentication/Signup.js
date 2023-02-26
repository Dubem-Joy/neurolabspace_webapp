import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AlertSnack from '../../components/alerts/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

const Signup = ({showSignup, handleShow}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmpass] = useState();
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const history = useHistory();

  // #close snack
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setView(!view);
  };
  
  // #change password visisbility
  const handleClickShowPassword = (event) => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // #submit signup form
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPass) {
      setView(true);
      setMessage('Please fill all fields')
      setSeverity('error')

      setLoading(false)
      return;
    }
    if (password !== confirmPass) {
      setView(true);
      setMessage('Password do not match')
      setSeverity('error')

      setLoading(false)
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };

      const { data } = await axios.post(
        '/api/users',
        { name, email, password },
        config
      );
      setView(true);
      setMessage('Registration is successful');
      setSeverity('success');
      
      localStorage.setItem('userInfo', JSON.stringify(data));

      setLoading(false);
      history.push('/userpage')

    } catch (error) {
      setView(true);
      setMessage(`Email is not authenticated: contact labspace.neurolab@gmail.com`);
      setSeverity('warning');
      setLoading(false);
    }
  };


  return (
    <div className={showSignup ? 'login-page' : "hide"}>
      <div className="login-form">
        <div className="login-title">
          <h3>Sign in to Labspace</h3>
        </div>
        <div className="login-main">
          <div className="username">
            <h4>Full name</h4>
            <OutlinedInput
              id="outlined-adornment-name"
              type='text'
              variant="outlined"
              sx={{width: '100%', marginTop: '0.3rem'}}
              inputprops={{ sx: { backgroundColor: 'white',  } }}
              size="small"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="email">
            <h4>Email address</h4>
            <OutlinedInput
              id="outlined-adornment-email"
              type='email'
              variant="outlined"
              sx={{width: '100%', marginTop: '0.3rem'}}
              inputprops={{ sx: { backgroundColor: 'white',  } }}
              size="small"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password">
            <h4>Password</h4>
            <div>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                size="small"
                variant="standard"
                inputprops={{ sx: { backgroundColor: 'white' } }}
                sx={{ width: '100%', marginTop: '0.3rem' }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
           <div className="confirm-password">
            <h4>Confirm password</h4>
            <div>
              <OutlinedInput
                id="outlined-adornment-confirmpassword"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirmpassword visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                size="small"
                variant="standard"
                inputprops={{ sx: { backgroundColor: 'white' } }}
                sx={{ width: '100%', marginTop: '0.3rem' }}
                onChange={(e) => setConfirmpass(e.target.value)}
              />
            </div>
          </div>
           
          <div className="submit">
            <LoadingButton
              className="submit-btn"
              variant="contained"
              onClick={submitHandler}
              loading={loading}
              inputprops={{ sx: { color: 'white' } }}
            >
              Sign up
            </LoadingButton>
            <AlertSnack view={view} handleClose={handleClose} message={ message} severity={severity} />
          </div>
        </div>
        <div className="login-footer">
                <h4 className='text-muted'>Already have an account? <span onClick={handleShow}>Sign in →</span></h4>
        </div>
      </div>
      
    </div>
  );
};

export default Signup;