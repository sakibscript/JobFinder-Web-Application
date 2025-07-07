"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  FaBell,
  FaHeart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import NotificationModal from "./notification/page";

type User = {
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  Role?: number;
  image?: string;
  isPremium: boolean;
  expiresAt: Date;
};

export default function TopBar({
  setIsLoginOpen,
  setIsRegistrationOpen,
  isDashboard = false,
}: {
  setIsLoginOpen: (val: boolean) => void;
  setIsRegistrationOpen: (val: boolean) => void;
  isDashboard?: boolean;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your application was reviewed!", time: "2h ago" },
    { id: 2, message: "New job posted in your category.", time: "5h ago" },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/job-seekers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <nav className="flex justify-between items-center bg-white/40 backdrop-blur-lg border border-white/20 shadow-md p-3 mb-6">
      <h1
        className="text-2xl font-extrabold text-blue-800 text-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        Job<span className="text-blue-500">Finder</span>
      </h1>

      <nav className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-blue-600 font-medium">
          Home
        </Link>
        <Link href="/jobs" className="hover:text-blue-600 font-medium">
          Jobs
        </Link>
        <Link href="/categories" className="hover:text-blue-600 font-medium">
          Categories
        </Link>
        <Link href="/about" className="hover:text-blue-600 font-medium">
          About
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center space-x-2 text-sm text-blue-600 font-medium cursor-pointer"
            >
              <FaSignInAlt className="text-base" />
              <span>Login</span>
            </button>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="flex items-center space-x-2 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              <FaUserPlus className="text-base" />
              <span>Register</span>
            </button>
          </>
        ) : (
          <>
            {/* <button className="text-blue-600 hover:text-blue-800" title="Notifications">
              <FaBell size={18} />
            </button> */}
            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
            />

            <button
              className="text-blue-600 hover:text-blue-800"
              title="Saved Jobs"
            >
              <FaHeart size={18} />
            </button>

            {isDashboard ? (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 cursor-pointer"
                title="Logout"
              >
                <FaSignOutAlt size={18} />
              </button>
            ) : (
              <img
                src={
                  user.image ||
                  "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
                }
                alt="User"
                className="w-9 h-9 rounded-full border-2 border-blue-600 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              />
            )}
          </>
        )}
      </div>
    </nav>
  );
}
