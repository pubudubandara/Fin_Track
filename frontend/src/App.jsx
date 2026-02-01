import { BrowserRouter, Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import LandingPage from './pages/landing/LandingPage.jsx'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Transactions from './pages/transactions/Transactions.jsx'
import Groups from './pages/groups/Groups.jsx'
import GroupDetails from './pages/groups/GroupDetails.jsx'
import Analyze from './pages/analyze/Analyze.jsx'
import Settings from './pages/settings/Settings.jsx'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
