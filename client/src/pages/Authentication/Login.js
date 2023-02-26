import React, { useState }  from 'react';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import AlertSnack from '../../components/alerts/Alert';
import { ProjectState } from '../../context/projectProvider';

const Login = ({showLogin, handleShow}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const history = useHistory();

  const { setLoggedUser } = ProjectState();

  // #close snack
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setView(!view);
  };

  // #change password visisbility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // #submit login form
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setView(true);
      setMessage('Please fill all fields')
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
        '/api/users/login',
        { email, password },
        config
      );
      setView(true);
      setMessage('Login successful');
      setSeverity('success');
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      setLoading(false);
      history.push('/userpage')

    } catch (error) {
      setView(true);
      setMessage(`${error.response.data.message}`);
      setSeverity('error');
      setLoading(false);
    }
  };

  return (
    <div className={showLogin ? 'login-page' : "hide"}>
      <div className="login-form">
        <div className="login-title">
          <h3>Sign in to Labspace</h3>
        </div>
        <div className="login-main">
          <div className="username">
            <h4>Email address</h4>
            <OutlinedInput
              id="outlined-adornment"
              variant="outlined"
              sx={{ width: '100%', marginTop: '0.3rem' }}
              inputprops={{ sx: { backgroundColor: 'white', } }}
              size="small"
              type='email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password">
            <h4>Password</h4>
            <div>
              <OutlinedInput
                id="outlined-adornment-password 1"
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
          <div className="submit">
            <LoadingButton
              className="submit-btn"
              variant="contained"
              onClick={submitHandler}
              loading={loading}
              inputprops={{ sx: { color: 'white' } }}
            >
              Sign in
            </LoadingButton>
            <AlertSnack view={view} handleClose={handleClose} message={ message} severity={severity} />
          </div>
        </div>
        <div className="login-footer">
          <h4 className='text-muted'>New to Labspace?  <span onClick={handleShow}>Create an account.</span> </h4>
        </div>
      </div>
    </div>
  );
};

export default Login;
