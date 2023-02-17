import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Dashboard from './scenes/dashboard';
import {
  CssBaseline,
  ThemeProvider,
  AlertTitle,
  Alert,
  LinearProgress,
} from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Form from './scenes/form';
import FormEmail from './scenes/form_email';
import mariaSong from './assets/sounds/maria.mp3';

function App() {
  const [theme, colorMode] = useMode();
  const [alarmAudio] = useState(new Audio(mariaSong));
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const playAlarm = useCallback(() => {
    alarmAudio.play();
    setAlarmPlaying(true);
  }, [alarmAudio, setAlarmPlaying]);

  const fetchProductData = useCallback(async () => {
    fetch(`${process.env.REACT_APP_DB_URL}/products`)
      .then((respond) => respond.json())
      .then((productsData) => {
        setProducts(productsData);
        setProductsLoaded(true);
        for (let i = 0; i < productsData.length; ++i) {
          if (productsData[i]['notify']) {
            playAlarm();
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
        setProductsLoaded(false);
        setTimeout(fetchProductData, 1000);
      });
  }, [setProducts, playAlarm]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            {!productsLoaded && (
              <Alert variant="filled" severity="error">
                <AlertTitle>Error</AlertTitle>
                Producst data is not loaded
              </Alert>
            )}

            <Topbar products={products} />
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    fetchProductData={fetchProductData}
                    alarmAudio={alarmAudio}
                    setAlarmPlaying={setAlarmPlaying}
                    alarmPlaying={alarmPlaying}
                    playAlarm={playAlarm}
                    products={products}
                    setProducts={setProducts}
                    productsLoaded={productsLoaded}
                  />
                }
              />
              <Route path="/form" element={<Form />} />
              <Route path="/form_email" element={<FormEmail />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
