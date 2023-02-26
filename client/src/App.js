import { Route, useHistory } from "react-router-dom";
import './App.css';

// #Components
import UserPage from "./pages/UserPage";
import Home from "./pages/Home";


function App() {
 
  return (
    <div className="App">
      <Route path="/" exact> <Home/> </Route>
      <Route path="/userpage" exact> <UserPage /> </Route>
    </div>
  );
};

export default App;
