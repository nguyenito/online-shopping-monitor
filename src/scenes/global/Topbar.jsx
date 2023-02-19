import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme, Badge } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
const Topbar = ({products}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [notifyCount, setNotifyCount] = useState(0);
  
  const navigateToFormEmail = () => {
    navigate('/form_email');
  };
  const navigateToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    let count = 0;
    for(let i = 0; i < products.length; ++i){
      if(products[i]['notify']){
        count += 1;
      }
    }
    if(count !== notifyCount){
      setNotifyCount(count);
    }
  }, [products, notifyCount]);
  
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>

      {/* ICONS */}
      <Box display="flex">
      <IconButton onClick={navigateToHome}>
          <HomeOutlinedIcon />
        </IconButton>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton >
        <Badge badgeContent={notifyCount} color="secondary">
          <NotificationsOutlinedIcon />
        </Badge>
        </IconButton>
        <IconButton onClick={navigateToFormEmail}>
          <SettingsOutlinedIcon />
        </IconButton>
        {/* <IconButton >
          <PersonOutlinedIcon />
        </IconButton> */}
      </Box>
    </Box>
  );
};

export default Topbar;
