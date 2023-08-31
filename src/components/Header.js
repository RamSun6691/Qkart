import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory,Link} from "react-router-dom"

const Header = ({ children, hasHiddenAuthButtons }) => {

  const history = useHistory();

  
  
  const handleClick = () => {
  
    history.push("/");
  };

  const routerToRegister=()=>{
    history.push("/register")
  }

  const routerToLogin=()=>{
    history.push("/login")
  }

  const logout = () =>{
    history.push("/")
    history.go()
    // localStorage.removeItem("username")
    // localStorage.removeItem("token")
    // localStorage.removeItem("balance")
    localStorage.clear() 
    

    // window.location.reload()
  }

  if(hasHiddenAuthButtons){
    return(
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
        </Box>
        {children}
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={handleClick}
        >
        Back to explore
          
        </Button>

      </Box>
    )
  }
    return (
      <Box className="header">
        <Box className="header-title">
        <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
        </Box>
        {children}
        <Stack direction="row" spacing={1} alignItems="center">
          {localStorage.getItem("username") ? (
            <>
            <Avatar 
            src="avatar.png"
            alt={localStorage.getItem("username") || "profile"}
            />
            <p className="username-text">{localStorage.getItem("username")}</p>

            <Button type="primary" onClick={logout}>
              Logout
            </Button>
            </>
          ):(
            <>
            <Button onClick={routerToLogin}>
              Login
            </Button>
            <Button type="primary" onClick={routerToRegister}>
              Register
            </Button>
            </>
          )}
        </Stack>
        {/* <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={handleClick}
        >
        Back to explore
          
        </Button> */}
        
        
      
      </Box>
    );
};

export default Header;
