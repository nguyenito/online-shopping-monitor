import { useState } from 'react';
import { Box, Button, TextField, Alert, useTheme} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
const Form = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [displayFail, setDisplayFail] = useState(false);
    const [messageFail, setMessageFail] = useState("Unknown Error");
    const [displayWarning, setDisplayWarning] = useState(false);
    const navigate = useNavigate();
  

    async function getProductsFromDB() {
        return fetch(`${process.env.REACT_APP_DB_URL}/products`)
        .then((respond) => respond.json())
        .then((json) => {
            return json;
        }).catch((err) => {
            console.log(err.message);
            setMessageFail("Failed to fetch products database from server. Error: " + err.message);
            setDisplayFail(true);
            return null;
        });
    }
    async function postProductToDb(productData){
        return fetch(`${process.env.REACT_APP_DB_URL}/products`,
        {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(productData)
        }).then((respond) => setDisplaySuccess(true))
        .catch((err) => {
            console.log(err.message);
            setMessageFail(err.message);
            setDisplayFail(true);
            return null;
        });
    }

    const isProductUrlExist = async (productsDb, productUrl) => {
        let isExist = false;
        for(let i = 0; i < productsDb.length;++i){
            const currentUrl = productsDb[i]['product_url'];
            console.log('Checking current product url: ', currentUrl);
            if(productUrl === currentUrl){
                console.log("Product is Exist");
                isExist = true;
                break;
            }
        }
        return isExist;
  }

  const handleFormSubmit = async (values) => {
     
    const productsDb = await getProductsFromDB();
    if(productsDb === null){ 
        return;
    }

    let isExist = await isProductUrlExist(productsDb, values.productUrl);
    console.log(isExist ? "Product URL is Exist in Watcher List" : "New Product URL Added");
    if(!isExist){
        const productData = {
            product_url: values.productUrl,
            product_name: values.productName, 
            status: "New",
            notify: false
        };
        postProductToDb(productData);
    }
    else{
        setDisplayWarning(true);
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box m="20px">
        <Box>
        <Button onClick={navigateToDashboard}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "18px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    }}
            >
                <DashboardOutlinedIcon sx={{ mr: "15px" }} />
                DASHBOARD
            </Button>
        </Box>
        
        <Header title="CREATE WATCHER" subtitle="Create a New Product Watcher" />
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
                label="Product Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.productName}
                name="productName"
                error={!!touched.productName && !!errors.productName}
                helperText={touched.productName && errors.productName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Product URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.productUrl}
                name="productUrl"
                error={!!touched.productUrl && !!errors.productUrl}
                helperText={touched.productUrl && errors.productUrl}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Product Monitoring
              </Button>
            </Box>
            <Box  justifyContent="end" mt="20px">
            {displaySuccess && <Alert 
                                severity="success"
                                action={
                                    <Button onClick={navigateToDashboard}
                                    sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.grey[100],
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    padding: "10px 20px",
                                    }}
                            >
                            Go Back Dashboard
                            </Button>
                                  }>
                                Added Product To Watcher Successfully</Alert>}
            {displayFail && <Alert onClose={() => {setDisplayFail(false);}} severity="error">{messageFail}</Alert>}
            {displayWarning && <Alert onClose={() => {setDisplayWarning(false);}} severity="warning">Product Url Already Exist In Watcher List!</Alert>}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
    productName: yup.string().required("required"),
    productUrl: yup.string().required("required"),
});
const initialValues = {
    productName: "",
    productUrl: ""
};

export default Form;
