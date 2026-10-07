import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewSwap from "./pages/NewSwap";
import SwapHistory from "./pages/SwapHistory";
import SwapDetail from "./pages/SwapDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/swaps/new" element={<NewSwap />} />
        <Route path="/swaps" element={<SwapHistory />} />
        <Route path="/swaps/:id" element={<SwapDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/swaps/new" replace />} />
    </Routes>
  );
}
