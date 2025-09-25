"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaBell,
  FaHeart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaCheckCircle,
  FaTrash,
  FaTimes,
  FaBriefcase,
  FaEnvelope,
  FaBullhorn,
  FaClock,
} from "react-icons/fa";
import axios from "axios";

type User = {
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  Role?: number;
  imageUrl?: string;
  isPremium: boolean;
  expiresAt: Date;
};

type Notification = {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type?: string;
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
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Your application was reviewed!",
      time: "2h ago",
      read: false,
      type: "application",
    },
    {
      id: 2,
      message: "New job posted in your category.",
      time: "5h ago",
      read: false,
      type: "alert",
    },
    {
      id: 3,
      message: "Welcome to JobFinder! Start exploring jobs.",
      time: "1d ago",
      read: true,
      type: "success",
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/job-seekers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        scrollToSectionOnHomepage(sectionId);
      }, 100);
    } else {
      scrollToSectionOnHomepage(sectionId);
    }
  };

  const scrollToSectionOnHomepage = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["home", "jobs", "categories", "about"];
      const offset = 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom >= offset) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "jobs", label: "Jobs" },
    { id: "categories", label: "Categories" },
    { id: "about", label: "About" },
  ];

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    setShowNotifications(false);
    toast.success("All notifications cleared!");
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "application":
        return <FaBriefcase size={16} />;
      case "message":
        return <FaEnvelope size={16} />;
      case "alert":
        return <FaBullhorn size={16} />;
      case "success":
        return <FaCheckCircle size={16} />;
      default:
        return <FaBell size={16} />;
    }
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800/90 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-32 h-8 bg-gray-500 rounded-lg animate-pulse"></div>
          <div className="w-48 h-8 bg-gray-500 rounded-lg animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-95 backdrop-blur-md border-b border-gray-700/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              onClick={() => {
                if (pathname !== "/") {
                  router.push("/");
                } else {
                  scrollToSection("home");
                }
              }}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-blue-700 transition-all duration-300">
                JobFinder
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative font-medium pb-1 transition-all duration-300 group cursor-pointer ${
                    activeSection === item.id && pathname === "/"
                      ? "bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent font-semibold"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 to-blue-600 transition-transform duration-300 ${
                      activeSection === item.id && pathname === "/"
                        ? "scale-x-0"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </button>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {!user ? (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="hidden sm:flex items-center space-x-2 text-gray-400 hover:text-gray-200 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
                  >
                    <FaSignInAlt className="text-base" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setIsRegistrationOpen(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FaUserPlus className="text-base" />
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Join</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, read: true }))
                        );
                        setUnreadCount(0);
                      }}
                      className="relative p-2.5 text-gray-400 hover:text-gray-200 transition-all duration-300 cursor-pointer rounded-lg hover:bg-gray-700/50 group"
                      title="Notifications"
                    >
                      <FaBell
                        size={18}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-gray-800 shadow-lg animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowNotifications(false)}
                        />

                        {/* Notification Dropdown */}
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/80 backdrop-blur-xl z-50 max-h-96 overflow-hidden transform origin-top-right animate-scale-in">
                          {/* Header */}
                          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Notifications
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {unreadCount > 0
                                    ? `${unreadCount} unread`
                                    : "All caught up"}
                                </p>
                              </div>
                              {notifications.length > 0 && (
                                <button
                                  onClick={clearAll}
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                >
                                  Clear All
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-72 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                  <FaBell className="text-gray-400 text-2xl" />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">
                                  No notifications yet
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  We'll notify you when something arrives
                                </p>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                  <div
                                    key={notification.id}
                                    className={`p-4 transition-all duration-300 hover:bg-gray-50/80 group ${
                                      notification.read
                                        ? "bg-white"
                                        : "bg-blue-50/50 border-l-4 border-l-blue-500"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-3">
                                      {/* Notification Icon */}
                                      <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                          notification.read
                                            ? "bg-gray-100 text-gray-600"
                                            : "bg-blue-100 text-blue-600"
                                        }`}
                                      >
                                        {getNotificationIcon(notification.type)}
                                      </div>

                                      {/* Notification Content */}
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`text-sm font-medium ${
                                            notification.read
                                              ? "text-gray-900"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                          <FaClock className="mr-1" size={10} />
                                          {formatTime(notification.time)}
                                        </p>
                                      </div>

                                      {/* Action Button */}
                                      {!notification.read && (
                                        <button
                                          onClick={() =>
                                            markAsRead(notification.id)
                                          }
                                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center"
                                          title="Mark as read"
                                        >
                                          <FaCheckCircle
                                            size={12}
                                            className="text-white"
                                          />
                                        </button>
                                      )}
                                    </div>

                                    {/* Status Indicator */}
                                    {!notification.read && (
                                      <div className="flex items-center mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                                          New
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          {notifications.length > 0 && (
                            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                              <button
                                onClick={() => {
                                  setNotifications((prev) =>
                                    prev.map((n) => ({ ...n, read: true }))
                                  );
                                  setUnreadCount(0);
                                  setShowNotifications(false);
                                  router.push("/notifications");
                                }}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 py-2"
                              >
                                View All Notifications
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Saved Jobs */}
                  <button
                    className="p-2.5 text-gray-400 hover:text-red-400 transition-colors duration-300 cursor-pointer rounded-lg hover:bg-gray-700/50"
                    title="Saved Jobs"
                  >
                    <FaHeart size={18} />
                  </button>

                  {/* User Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-1.5 rounded-2xl border border-gray-600/50 hover:border-gray-400 transition-all duration-300 cursor-pointer bg-gray-800/50 hover:bg-gray-700"
                    >
                      <img
                        src={
                          user.imageUrl ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&rounded=full"
                        }
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-gray-600"
                      />
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-300 leading-none">
                          {user.fullName.split(" ")[0]}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user.isPremium ? "Premium" : "Basic"}
                        </p>
                      </div>
                      <FaChevronDown
                        size={12}
                        className={`text-gray-500 transition-transform duration-300 ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 rounded-xl shadow-2xl border border-gray-700/80 backdrop-blur-md py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="text-sm font-semibold text-gray-200">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            router.push("/dashboard");
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors duration-200 flex items-center space-x-3"
                        >
                          <FaUserCircle className="text-blue-400" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            router.push("/profile");
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors duration-200 flex items-center space-x-3"
                        >
                          <FaUserCircle className="text-green-400" />
                          <span>My Profile</span>
                        </button>

                        <div className="border-t border-gray-800 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/50 transition-colors duration-200 flex items-center space-x-3"
                          >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom Bar) */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/60 md:hidden">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                activeSection === item.id && pathname === "/"
                  ? "text-gray-300 bg-gray-700/50"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  activeSection === item.id && pathname === "/"
                    ? "font-semibold"
                    : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}

          {/* Login/User Button */}
          {!user ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[60px] text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
            >
              <FaSignInAlt className="w-5 h-5" />
              <span className="text-xs font-medium">Login</span>
            </button>
          ) : (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                showUserMenu
                  ? "text-gray-300 bg-gray-700/50"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
              }`}
            >
              <FaUserCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}
