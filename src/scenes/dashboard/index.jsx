import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import QueuePlayNextOutlinedIcon from '@mui/icons-material/QueuePlayNextOutlined';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import ProductTable from "./products"
import AlarmOffOutlinedIcon from '@mui/icons-material/AlarmOffOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';


const Dashboard = ({playAlarm, alarmPlaying, alarmAudio, setAlarmPlaying, fetchProductData, products, setProducts, productsLoaded}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alarmCount, setAlarmCount] = useState(1);
  const [monitorInterval, setMonitorInterval] = useState(1);
  
  const stopAlarm = () => {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    setAlarmPlaying(false);
    fetchNotificationInfoFromDB();
  };

  const navigateToForm = () => {
    navigate('/form');
  };

  const fetchNotificationInfoFromDB = useCallback(async () => {
    fetch(`${process.env.REACT_APP_DB_URL}/notification_info/1`)
    .then((respond) => respond.json())
    .then((json) => {
        setEmail(json.email);
        setAlarmCount(json.alarm_count);
        setMonitorInterval(json.monitor_interval);
    }).catch((err) => {
        console.log(err.message);
    });
  }, [setEmail, setAlarmCount]);

  useEffect(() => {
    fetchNotificationInfoFromDB();
  }, [fetchNotificationInfoFromDB]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="MONITOR DASHBOARD" subtitle="Online Shopping Monitoring" />
        <Box>
          <Button onClick={navigateToForm}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "18px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}

          >
            <QueuePlayNextOutlinedIcon sx={{ mr: "15px" }} />
            Monitor Product
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={email}
            subtitle="Notification Email"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={alarmCount}
            subtitle="Alarm Counted"
            icon={
              <AlarmOnOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={monitorInterval}
            subtitle="Monitoring Interval (In Seconds)"
            icon={
              <ChangeCircleOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>        
      </Box>
      <ProductTable  fetchProductData={fetchProductData} alarmPlaying={alarmPlaying} playAlarm={playAlarm} stopAlarm={stopAlarm} products={products} setProducts={setProducts} productsLoaded={productsLoaded}/>
    </Box>
    
  );
};

export default Dashboard;
