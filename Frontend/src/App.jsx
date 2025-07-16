import './App.css'
import Dashboard from './components/dashboard'
import ForgotPage from './components/forgot'
import LoginPage from './components/login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Vehicles from './components/vehicles'
import Managers from './components/managers'
import Driver from './components/drivers'
import { isAuthenticated } from './authenticate/auth'
import { ProtectedRoute } from './authenticate/protected_route'
import LayoutHeader from './components/layoutHeader'
import DriverDetail from './components/driver_detail'
import RegisterUser from './components/user_register'
import RegisterDriverProfile from './components/driver_profile'
import AddVehicle from './components/vehicle_add'
import DriverUpdate from './components/driver_update'
import ManagerDetail from './components/manager_detail'
import Update_User from './components/user_update'



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login_page" />
          } />
          <Route path="/login_page" element={<LoginPage />} />
          <Route path="forgot_password" element={<ForgotPage />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <LayoutHeader />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='vehicles' element={<Vehicles />} />
            <Route path='addvehicle' element={<AddVehicle />} />

            <Route path='registerUser' element={<RegisterUser />} />
            <Route path='updateUser/:userId' element={<Update_User/>}/>

            <Route path='managers' element={<Managers />} />
            <Route path='managers/:managerID' element={<ManagerDetail />} />


            <Route path='drivers' element={<Driver />} />
            <Route path='drivers/:driverID' element={<DriverDetail />} />
            <Route path='registerDriver/:driverUsername' element={<RegisterDriverProfile/>}/>
            <Route path='drivers/:driverID/updateDriver' element={<DriverUpdate/>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
