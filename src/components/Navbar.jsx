import { Link, NavLink } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const linkClass = ({ isActive }) =>
  `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600 hover:text-gray-900"}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/swaps/new" className="flex items-center gap-2 font-semibold text-gray-900">
            <Sparkles size={20} className="text-indigo-600" />
            FaceSwap Studio
          </Link>
          <nav className="flex gap-4">
            <NavLink to="/swaps/new" className={linkClass}>
              New swap
            </NavLink>
            <NavLink to="/swaps" end className={linkClass}>
              History
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
          <Button variant="secondary" onClick={logout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
