"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import EditProfileModal from "./edit-profile/page";
import TopBar from "../topBar/page";
import PremiumPaymentModal from "../payment/page";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFilePdf,
  FaCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaClock,
  FaBriefcase,
  FaCommentDots,
  FaChartLine,
} from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import axios from "axios";

type User = {
  jobSeekerId: number;
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  Role?: number;
  imageUrl?: string;
  isPremium: boolean;
  expiresAt: string;
};

type Application = {
  jobApplicationId: number;
  status: string;
  appliedAt: Date;
  job: {
    title: string;
    company: string;
  };
};

type Interview = {
  role: string;
  date: string;
  time: string;
  type: string;
};

type Message = {
  sender: string;
  preview: string;
  unread: boolean;
  createdAt: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const userRes = await axios.get(
          `http://localhost:3000/job-seekers/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userRes.data);

        const applicationsRes = await axios.get(
          `http://localhost:3000/job-applications/recent/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentApplications(applicationsRes.data);

        const interviewRes = await axios.get(
          `http://localhost:3000/interviews/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInterviews(interviewRes.data);

        const messagesRes = await axios.get(
          `http://localhost:3000/job-applications/messages/recent/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(messagesRes.data.slice(0, 2));
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/");
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      toast.success("Premium Activated!");
    }
  }, []);

  const handleUserSave = (updatedUser: User) => {
    setUser(updatedUser);
    toast.success("Profile updated!");
  };

  const totalApplied = recentApplications.length;
  const totalResponded = recentApplications.filter(
    (app) => app.status !== "pending" && app.status !== "applied"
  ).length;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const applicationsThisWeek = recentApplications.filter((app) => {
    const created = new Date(app.appliedAt || "");
    return created >= startOfWeek;
  });

  const applicationsThisMonth = recentApplications.filter((app) => {
    const created = new Date(app.appliedAt || "");
    return created >= startOfMonth;
  });

  const categoryCount: Record<string, number> = {};
  recentApplications.forEach((app) => {
    const category = app.job?.title || "Unknown";
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const mostAppliedCategory =
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const statusOrder = {
    applied: 1,
    pending: 1,
    reviewed: 2,
    "under review": 2,
    interview_scheduled: 3,
    hired: 4,
    rejected: 4,
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-xl text-gray-600">
          Loading dashboard...
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-xl text-red-600">
          Failed to load user data.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Toaster position="top-center" />

      <div className="absolute inset-0 z-0 bg-white" />
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2QxZTRmZSIvPgo8Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0iIzllYmEwYyIvPgo8Y2lyY2xlIGN4PSI5IiBjeT0iMSIgcj0iMSIgZmlsbD0iIzllYmEwYyIvPgo8Y2lyY2xlIGN4PSIxIiBjeT0iOSIgcj0iMSIgZmlsbD0iIzllYmEwYyIvPgo8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMSIgZmlsbD0iIzllYmEwYyIvPgo8L3N2Zz4=')",
        }}
      />
      <TopBar
        setIsLoginOpen={setIsLoginOpen}
        setIsRegistrationOpen={setIsRegistrationOpen}
        isDashboard={true}
      />

      <div className="relative z-10 pt-28 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Left Column - Profile & Stats */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.01]">
              <img
                src={
                  user.imageUrl ||
                  "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
                }
                alt="User Avatar"
                className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-blue-200 shadow-md"
              />
              <h3 className="font-bold text-2xl text-gray-800 mb-1">
                {user.fullName}
              </h3>
              <p className="text-sm text-gray-500 font-medium">{user.email}</p>
              <button
                onClick={() => setIsEditOpen(true)}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300"
              >
                Edit Profile
              </button>
            </div>

            {/* Profile Strength */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 transform hover:scale-[1.01]">
              <h4 className="font-bold text-lg text-gray-800 mb-3">
                Profile Strength
              </h4>
              {(() => {
                const totalItems = 5;
                const filled = [
                  user.imageUrl &&
                    user.imageUrl !==
                      "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
                  user.resumeUrl,
                  user.phone,
                  user.fullName,
                  user.email,
                ].filter(Boolean).length;
                const percentage = Math.round((filled / totalItems) * 100);

                const suggestions = [];
                if (
                  !user.imageUrl ||
                  user.imageUrl ===
                    "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
                ) {
                  suggestions.push("Upload a profile picture");
                }
                if (!user.resumeUrl) {
                  suggestions.push("Add resume");
                }
                if (!user.phone) {
                  suggestions.push("Verify phone");
                }

                return (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Your profile is{" "}
                      <span className="font-bold text-green-600">
                        {percentage}%
                      </span>{" "}
                      complete
                    </p>
                    {suggestions.length > 0 && (
                      <ul className="text-sm space-y-2">
                        {suggestions.map((sug, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-red-500"
                          >
                            <FaTimesCircle className="mr-2 text-red-400" />
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                    {suggestions.length === 0 && (
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2 text-green-500" />
                        <span className="font-medium">
                          Profile is complete!
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Main Column - Insights & Applications */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Application Insights */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 transform hover:scale-[1.01]">
              <h4 className="font-bold text-xl text-gray-800 flex items-center mb-4">
                <FaChartLine className="mr-3 text-blue-600" />
                Application Insights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {totalApplied}
                  </p>
                  <p className="text-sm text-gray-500">Jobs Applied</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {totalResponded}
                  </p>
                  <p className="text-sm text-gray-500">Jobs Responded</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {applicationsThisWeek.length}
                  </p>
                  <p className="text-sm text-gray-500">This Week</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {applicationsThisMonth.length}
                  </p>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 transform ">
              <h4 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                <FaBriefcase className="mr-3 text-blue-600" />
                Recent Applications
              </h4>
              {recentApplications.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  No recent applications.
                </p>
              ) : (
                <div className="space-y-6">
                  {recentApplications.slice(0, 3).map((app, idx) => {
                    const currentStage =
                      statusOrder[
                        app.status.toLowerCase() as keyof typeof statusOrder
                      ] || 0;
                    return (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-lg text-blue-800">
                            {app.job?.title || "Untitled Job"}
                          </h5>
                          <span className="text-sm text-gray-500 capitalize">
                            {app.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {app.job?.company || "Unknown Company"}
                        </p>
                        <div className="flex items-center justify-between relative">
                          <div className="absolute top-2.5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                          <div
                            className={`absolute top-2.5 left-0 h-1 bg-blue-500 z-10 transition-all duration-500`}
                            style={{ width: `${(currentStage / 4) * 100}%` }}
                          ></div>
                          {["Applied", "Reviewed", "Interview", "Decision"].map(
                            (stage, index) => {
                              const stageNumber = index + 1;
                              const isCompleted = currentStage >= stageNumber;
                              const isCurrent = currentStage === stageNumber;
                              const isLast = index === 3;
                              return (
                                <div
                                  key={index}
                                  className={`flex flex-col items-center z-20 w-1/4 transition-colors duration-300 ${isLast ? "" : "flex-1"}`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                      isCompleted
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-gray-500"
                                    } ${isCurrent ? "ring-2 ring-blue-300" : ""}`}
                                  >
                                    {isCompleted ? (
                                      <FaCheckCircle size={10} />
                                    ) : (
                                      <FaCircle size={10} />
                                    )}
                                  </div>
                                  <span
                                    className={`text-xs mt-2 text-center transition-colors duration-300 ${
                                      isCompleted
                                        ? "text-blue-700 font-semibold"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {stage}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Messages & Interviews */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Messages */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-xl text-gray-800 flex items-center">
                  <FaCommentDots className="mr-3 text-blue-600" />
                  Messages
                </h4>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No new messages.
                  </p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                        msg.unread
                          ? "bg-yellow-50 hover:bg-yellow-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => router.push("/messages")}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-800">
                          {msg.sender}
                        </span>
                        {msg.unread && (
                          <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {msg.preview}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-xl text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-3 text-blue-600" />
                  Upcoming Interviews
                </h4>
              </div>
              <div className="space-y-4">
                {interviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No interviews scheduled.
                  </p>
                ) : (
                  interviews.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                    >
                      <div>
                        <h5 className="font-semibold text-gray-800">
                          {item.role}
                        </h5>
                        <p className="text-sm text-gray-500">
                          <FaCalendarAlt className="inline-block mr-1 text-gray-400" />
                          {item.date}
                        </p>
                        <p className="text-sm text-gray-500">
                          <FaClock className="inline-block mr-1 text-gray-400" />
                          {item.time}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 mt-2 sm:mt-0 rounded-full font-semibold capitalize ${
                          item.type === "Zoom"
                            ? "bg-blue-100 text-blue-700"
                            : item.type === "In-Person"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.type.replace("-", " ")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Premium Subscription */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-100/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-xl text-gray-800 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse"></div>
                    <span>Premium Subscription</span>
                  </h4>
                </div>

                {user?.isPremium ? (
                  <div className="text-sm space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          🌟 You're a Premium Member!
                        </p>
                        <p className="text-green-700 text-sm">
                          Unlock exclusive benefits and priority support.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span>Access to exclusive jobs</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span>Priority application review</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span>Premium-only webinars & workshops</span>
                      </li>
                    </ul>

                    <div className="pt-4 border-t border-blue-100/50 mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Subscription active until:
                      </p>
                      <p className="font-semibold text-blue-700 text-sm">
                        {new Date(user.expiresAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        toast("Subscription management coming soon!");
                      }}
                      className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Manage Subscription
                    </button>
                  </div>
                ) : (
                  <div className="text-sm space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-yellow-800">
                          Free Account Active
                        </p>
                        <p className="text-yellow-700 text-sm">
                          Upgrade to unlock premium features.
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span>Access to exclusive jobs</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span>Priority application review</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span>Premium-only webinars & workshops</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="mt-4 w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          onSave={handleUserSave}
        />
      )}
      {/* <PremiumPaymentModal
        jobSeekerId={user?.jobSeekerId}
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      /> */}
      <PremiumPaymentModal
        jobSeekerId={user?.jobSeekerId}
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        user={user} // Pass current logged-in user
      />
    </div>
  );
}
