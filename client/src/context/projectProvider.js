import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

// #Created project context
const ProjectContext = createContext();


// #exporting context
const ProjectProvider = ({ children }) => {
    // *creating and exporting user info through project context
    const [loggedUser, setLoggedUser] = useState([]);
    const [projects, setProjects] = useState([]);
    const [team, setTeam] = useState([]);
    const [projectEdit, setProjectEdit] = useState({});  
    const [selectedChat, setSelectedChat] = useState({});    
    const [notification, setNotification] = useState([]);
    const history = useHistory();

    const fetchProjects = async (user) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get('/projects', config);
            setProjects(data);

        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        // #checks if user is logged in
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setLoggedUser(userInfo);
        if (!loggedUser) {
            // history.push('/')
        } 
    }, [history]);
    

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            fetchProjects(userInfo)
        }
    }, [projects]);

    return (
        <ProjectContext.Provider
            value={{ loggedUser, setLoggedUser, projects, setProjects, team, setTeam, projectEdit, setProjectEdit, selectedChat, setSelectedChat, notification, setNotification }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const ProjectState = () => {
    // #using the project context
    return useContext(ProjectContext);
}


export default ProjectProvider;