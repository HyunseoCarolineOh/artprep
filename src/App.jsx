import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
