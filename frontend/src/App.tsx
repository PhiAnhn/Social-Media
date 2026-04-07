import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage.tsx";
import ChatAppPage from "./pages/ChatAppPage.tsx";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          {/* protectect routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<ChatAppPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
