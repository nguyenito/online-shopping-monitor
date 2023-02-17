import { useState, useEffect } from 'react';
import { Box, Button, TextField, Alert, useTheme, Badge} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

const FormEmail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [email, setEmail] = useState("");
  const [monitorInterval, setMonitorInterval] = useState(60);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayFail, setDisplayFail] = useState(false);
  const [messageFail, setMessageFail] = useState("Unknown Error");
  const navigate = useNavigate();
  
  async function putNotificationInfoToDb(notificationData){
      return fetch(`${process.env.REACT_APP_DB_URL}/notification_info/1`,
      {
          method: "PATCH",
          headers: {"content-type": "application/json"},
          body: JSON.stringify(notificationData)
      }).then((respond) => setDisplaySuccess(true))
      .catch((err) => {
          console.log(err.message);
          setMessageFail(err.message);
          setDisplayFail(true);
          return null;
      });
  }
  
  useEffect(() => {
    const fetchNotificationInfoFromDB = async () => {
      fetch(`${process.env.REACT_APP_DB_URL}/notification_info/1`)
      .then((respond) => respond.json())
      .then((json) => {
          setEmail(json.email);
          setMonitorInterval(json.monitor_interval);
      }).catch((err) => {
          console.log(err.message);
          setMessageFail("Failed to fetch notification info database from server. Error: " + err.message);
          setDisplayFail(true);
      });
    };
    fetchNotificationInfoFromDB();
  }, [setEmail]);

  const handleFormSubmit = async (values) => {
    const notificationInfo = {
      email: values.email,
      monitor_interval: values.monitor_interval
    };
    await putNotificationInfoToDb(notificationInfo);
    window.location.reload();
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <Box m="20px">
        <Box>
        <Button onClick={navigateToHome}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "18px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    }}
            >
                <HomeOutlinedIcon sx={{ mr: "15px" }} />
                HOME
            </Button>
        </Box> 
        <Header title="REGISTER NOTIFICATION EMAIL" subtitle="Key In Notification Email" />
        <Box display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }} >
          <Badge color="primary" sx={{ gridColumn: "span 3" }}>
            <MailIcon color="action" />
            Current Email: {email}
          </Badge>
          <Badge color="primary" sx={{ gridColumn: "span 1" }}>
            <ChangeCircleOutlinedIcon color="action" />
            Current Interval: {monitorInterval} seconds
          </Badge>
        </Box>
       
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Monitoring Interval (In Seconds)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.monitor_interval}
                name="monitor_interval"
                error={!!touched.monitor_interval && !!errors.monitor_interval}
                helperText={touched.monitor_interval && errors.monitor_interval}
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Notification Email
              </Button>
            </Box>
            <Box  justifyContent="end" mt="20px">
            {displaySuccess && <Alert 
                                severity="success">
                                Added Product To Watcher Successfully</Alert>}
            {displayFail && <Alert onClose={() => {setDisplayFail(false);}} severity="error">{messageFail}</Alert>}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const intervalRegExp = /^([0-9]+)$/;

const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  monitor_interval: yup
    .string()
    .matches(intervalRegExp, "Must be a number")
    .required("required"),
});

const initialValues = {
  email: "",
  monitor_interval: 120
}
export default FormEmail;
