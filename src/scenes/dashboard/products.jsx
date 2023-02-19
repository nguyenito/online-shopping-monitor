import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, CircularProgress, LinearProgress, Alert, AlertTitle, Skeleton, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import Header from "../../components/Header";
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {motion} from 'framer-motion';

const ProductTable = ({fetchProductData, alarmPlaying, playAlarm, stopAlarm, products, setProducts, productsLoaded, setBackendServerHeartbeat}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  async function deleteProduct(id){
    return fetch(`${process.env.REACT_APP_DB_URL}/products/${id}`,
    {
        method: "DELETE"
    }).then((respond) => {
      alert('Delete Product Id Successfully');
      window.location.reload();
    })
    .catch((err) => {
        alert("Fail to delete product. Error: " + err.message);
        return null;
    });
  }

  useEffect(() => {
    console.log(`Fetch Product Data From: ${process.env.REACT_APP_DB_URL}/products`);
    fetchProductData();

    console.log(`Fetch Stream Events Data From: ${process.env.REACT_APP_BACKEND_API}/events`);
    const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_API}/events`);
    eventSource.onerror = (err) => {
      console.log('There was an error from server', err);
      setLoadingMessage('There was an error from Shop-Monitor-Backend Server. Please contact Admin for more information');
      setProductLoading(true);
    };
    eventSource.onopen = (res) => {
      if (res.ok && res.status === 200) {
        console.log('Connection made ', res);
        setProductLoading(false);
      } else if (res.status >= 400 &&  res.status < 500 && res.status !== 429) {
        console.log('Client side error ', res);
        setProductLoading(true);
      }
    };

    eventSource.onmessage = (event) =>  {
      setBackendServerHeartbeat((prev) => prev+1);
      setProductLoading(false);
      const product = JSON.parse(event.data); 
    
      setProducts(products => products.map(function(data) {
        if(data.id === product.id){
          if(product.event_type === "alarm"){
            console.log("RECEIVE ALARM EVENT FROM SHOP-MONITOR BACKEND SERVER");
            playAlarm();
            data.notify = product.notify;
          }
          data.status = product.status;
        }
        return data;
        }));
      
    }
  }, [playAlarm, fetchProductData, setProducts]);

  const onDeleteProduct = async (e, row) => {
    console.log('Delete product id: ', row.id);
    if(window.confirm("Do you really want to remove and stop watching this product?")){
      await deleteProduct(row.id);
    }
  };

  async function updateNotifyProductToDb(id, notify){
    return fetch(`${process.env.REACT_APP_DB_URL}/products/${id}`,
    {
        method: "PATCH",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({ notify: notify })
    }).catch((err) => {
        console.log(err.message);
    });
  }

  const onAcknowledgeNotify = async (e, row) => {
    console.log('Acknowledge For Product It: ', row.id);
    updateNotifyProductToDb(row.id, false);
    window.location.reload();
    stopAlarm();
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true},
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    { field: 'product_url', headerName: 'Product URL', flex: 1, renderCell: (params) => {
      return (
        <Link href={params.row.product_url} color={colors.greenAccent[500]} target="_blank" rel="noopener noreferrer">{params.row.product_url}</Link>
       
      );
    } },
    { field: 'notify', headerName: 'Notify', width: 150, renderCell: (params) => {
      return (
        
        <Button
          disabled={!params.row.notify}
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: colors.grey[100],
            fontSize: "10px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={(e) => onAcknowledgeNotify(e, params.row)}
          variant="contained"
        >
          {params.row.notify ? (<motion.div animate={{x: [0, -20, 0], y: [0, -15, 0], rotate: [0, 360, 0]}} transition={{repeat: Infinity, duration: 1}}><NotificationsActiveIcon /></motion.div>) : 
          (<NotificationsOffIcon />)}
          Acknowledge
        </Button>
        
      );
    } },
    {
      field: "status",
      headerName: "Status",
     
      width: 180,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === "InStock"
                ? colors.greenAccent[500]
                : status === "OutStock"
                ? colors.greenAccent[900]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {status === "InStock" && <AddShoppingCartOutlinedIcon />}
            {status === "OutStock" && <RemoveShoppingCartOutlinedIcon />}
            {status === "Checking" && <CircularProgress color='success'/>}
            {status === "New" && <CloudOffOutlinedIcon color='success'/>}
            {status === "Unknown" && <HelpCenterOutlinedIcon/>}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status === "InStock" && "In Stock"}
              {status === "OutStock" && "Out Of Stock"}
              {status === "Checking" && "Checking"}
              {status === "New" && "New"}
              {status === "Unknown" && "Unknown"}
            </Typography>
          </Box>
        );
      },
    },
    { field: 'actions', headerName: 'Actions', width: 100, renderCell: (params) => {
      return (
        <Button
          sx={{
            backgroundColor: colors.redAccent[600],
            color: colors.grey[100],
            fontSize: "10px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={(e) => onDeleteProduct(e, params.row)}
          variant="contained"
        >
          Remove
        </Button>
      );
    } }
  ];

  return (
    <Box > 
      <Header title="PRODUCTS" subtitle="Managing the Products Stock" />
      {productLoading && <LinearProgress color='info' />}
      {productLoading && <Alert variant="filled" severity="error"><AlertTitle>Error</AlertTitle>{loadingMessage}</Alert>}
      <Box
      display="flex"
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {productsLoaded ? <DataGrid rows={products && products} columns={columns} /> : <Skeleton variant="rounded" width="100%" height="50%" animation="wave" />}
      </Box>
    </Box>
  );
};

export default ProductTable;
