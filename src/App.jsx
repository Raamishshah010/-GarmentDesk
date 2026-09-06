import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  UsersRound,
  Calendar as CalendarIcon,
  Percent,
  BarChart2,
  MessageCircle,
  Shirt,
  Scissors,
  Tag,
  Lock,
  CreditCard,
} from 'lucide-react'
import { I18nProvider } from './i18n/I18nContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Stores from './pages/Stores'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import ComingSoon from './pages/ComingSoon'

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login lives at the root URL */}
            <Route path="/" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="stores" element={<Stores />} />
              <Route path="team" element={<ComingSoon titleKey="nav.team" Icon={UsersRound} />} />
              <Route path="calendar" element={<ComingSoon titleKey="nav.calendar" Icon={CalendarIcon} />} />
              <Route path="commissions" element={<ComingSoon titleKey="nav.commissions" Icon={Percent} />} />
              <Route path="reports" element={<ComingSoon titleKey="nav.reports" Icon={BarChart2} />} />
              <Route path="support" element={<ComingSoon titleKey="nav.support" Icon={MessageCircle} />} />
              <Route path="garments" element={<ComingSoon titleKey="nav.garments" Icon={Shirt} />} />
              <Route path="alterations" element={<ComingSoon titleKey="nav.alterations" Icon={Scissors} />} />
              <Route path="coupons" element={<ComingSoon titleKey="nav.coupons" Icon={Tag} />} />
              <Route path="permissions" element={<ComingSoon titleKey="nav.permissions" Icon={Lock} />} />
              <Route path="billing" element={<ComingSoon titleKey="nav.billing" Icon={CreditCard} />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  )
}

export default App
