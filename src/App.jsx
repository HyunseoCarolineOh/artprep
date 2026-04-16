import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import HomePage from "./pages/HomePage"
import ArtworkDetailPage from "./pages/ArtworkDetailPage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
