import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AuthModal from "./AuthModal";

export default function TopBar(props) {
  const handleDrawerToggle = props.handleDrawerToggle;
  const drawerWidth = props.drawerWidth;

  // Logic for handling rendering of AuthModal.
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const handleAuthButtonClick = () => {
    setAuthModalOpen(!isAuthModalOpen);
  };


  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }} // 'sm' refers to the breakpoint size corresponding to small screens
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChangeX
        </Typography>
        {/* Sign in button */}
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LoginIcon />}
          onClick={handleAuthButtonClick}
        >
          Sign In
        </Button>
        <AuthModal isAuthModalOpen={isAuthModalOpen} handleAuthButtonClick={handleAuthButtonClick} />
      </Toolbar>
    </AppBar>
  );
}