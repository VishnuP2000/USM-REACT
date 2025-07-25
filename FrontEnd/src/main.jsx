import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/User/login/login.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {store , persistor} from './Redux/store.js'
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <PersistGate loading={null} persistor={persistor}>

  <BrowserRouter>
  <StrictMode>
    <App/>
  </StrictMode>
  </BrowserRouter>
    </PersistGate>
  </Provider>
)
