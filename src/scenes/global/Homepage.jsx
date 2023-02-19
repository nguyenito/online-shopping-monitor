import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Stack, Avatar , } from '@mui/material';
import HomePageImage from '../../assets/images/online-shopping-monitor-homepage.png';
import ShoppeImage from '../../assets/images/shoppe.png';
import ShoppingYahooJpImage from '../../assets/images/shopping-yahoo-jp.png';
import { useNavigate } from "react-router-dom";


const HomepageCard = () => {
  const navigate = useNavigate();

  const navigateToDashboard= () => {
    navigate('/dashboard');
  };

  return (
   
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={navigateToDashboard}>
        <CardMedia
          component="img"
          height="100%"
          width="100%"
          image={HomePageImage}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Online-Shopping Monitor Service
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Online-Shopping Monitor Service help you to keep tracking the status of your interest product whether it's In Stock or Out Of Stock. It will pop up an alarm sound and send notification to your registered email whenever your product is switch state from Out of Stock to In Stock
          </Typography>
        </CardContent>
      </CardActionArea>
      <Typography gutterBottom variant="h9" component="div">
      Supported Website
      </Typography>
      <Stack direction="row" spacing={2}>
      <Avatar sx={{ width: 70, height: 70 }} alt="Shoppe" src={ShoppeImage} />
      <Avatar sx={{ width: 70, height: 70 }} alt="ShoppingYahooJp" src={ShoppingYahooJpImage} />
      </Stack>
    </Card>
  );
}

export default HomepageCard;

