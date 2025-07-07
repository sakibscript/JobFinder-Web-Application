"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import EditProfileModal from "./edit-profile/page";
import TopBar from "../topBar/page";
import PremiumPaymentModal from "../payment/page";

// At the top of the component
// import ResumeView from "./resume/page";

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
  const [userEdit, setUserEdit] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

        const applicationsRes = await fetch(
          `http://localhost:3000/job-applications/recent/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (applicationsRes.ok) {
          const apps = await applicationsRes.json();
          setRecentApplications(apps);
        } else {
          console.error("Failed to fetch recent applications");
        }

        const interviewRes = await fetch(
          `http://localhost:3000/interviews/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (interviewRes.ok) {
          const interviewData = await interviewRes.json();
          setInterviews(interviewData);
        } else {
          console.error("Failed to fetch interviews");
        }

        const messagesRes = await fetch(
          `http://localhost:3000/job-applications/messages/recent/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (messagesRes.ok) {
          const msgs = await messagesRes.json();
          setMessages(msgs.slice(0, 2));
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/");
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
      // re-fetch user profile to update isPremium
    }
  }, []);

  const handleUserSave = (updatedUser: User) => {
    setUserEdit(updatedUser);
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

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user)
    return <div className="text-center mt-20 text-red-600">No user found</div>;

  const handleSaveProfile = async (updatedUser: User) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:3000/job-seekers/${updatedUser.jobSeekerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      setUser(data);
      toast.success("Profile updated successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to update profile");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200 relative">
      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-[url('https://xcelpros.com/wp-content/uploads/2019/10/careers-bg.jpg')] bg-cover bg-center opacity-10 blur-sm" />

      {/* Navbar */}
      <TopBar
        setIsLoginOpen={setIsLoginOpen}
        setIsRegistrationOpen={setIsRegistrationOpen}
        isDashboard={true}
      />

      <div className="grid grid-cols-13 gap-2 relative z-10 p-3">
        {/* Left Column */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          {/* Message */}
          <div className="bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20">
            <h4 className="font-semibold text-blue-900 text-lg mb-3">
              Messages
            </h4>
            <div className="space-y-3 text-sm text-gray-800">
              {messages.length === 0 ? (
                <p className="text-gray-600 italic">No messages</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg transition hover:bg-white/70 cursor-pointer ${
                      msg.unread ? "bg-yellow-100" : "bg-white/50"
                    }`}
                    onClick={() => router.push("/messages")}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-blue-800">
                        {msg.sender}
                      </span>
                      {msg.unread && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 line-clamp-1">{msg.preview}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}

              {messages.length > 0 && (
                <div className="text-right mt-3">
                  <button
                    className="text-blue-700 text-xs hover:underline"
                    onClick={() => router.push("/messages")}
                  >
                    View All Messages →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20">
            <h4 className="font-semibold text-blue-900 text-lg mb-3">
              {" "}
              Upcoming Interviews
            </h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/50"></div>

              {interviews.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  No upcoming interviews
                </p>
              ) : (
                interviews.map((item, index) => (
                  <div key={index} className="relative pl-8 pb-6 last:pb-0">
                    <div className="absolute left-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100"></div>
                    <div className="bg-white/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-blue-800">
                          {item.role}
                        </h5>
                        <span
                          className={`text-xs px-2 py-1 rounded-full  ${
                            item.type === "Zoom"
                              ? "bg-blue-100 text-blue-800"
                              : item.type === "In-Person"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                      <div className="flex items-center mt-2 text-sm text-blue-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20">
            <h4 className="font-semibold text-blue-900 text-lg mb-3">
              Premium Subscription
            </h4>

            {user?.isPremium ? (
              <div className="text-sm text-green-800 space-y-2">
                <p className="font-semibold">🌟 You are a Premium Member</p>
                <ul className="list-disc list-inside text-green-700">
                  <li>Access to exclusive jobs</li>
                  <li>Priority application review</li>
                  <li>Premium-only webinars/workshops</li>
                </ul>
                <p className="text-xs text-gray-600">
                  Your subscription is active until:{" "}
                  <span className="font-semibold text-blue-800">
                    {new Date(user.expiresAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            ) : (
              <div className="text-sm text-gray-800 space-y-2">
                <p className="font-semibold text-yellow-800">
                  You're using a free account
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Upgrade for exclusive job posts</li>
                  <li>Attend premium webinars</li>
                  <li>Boost your profile visibility</li>
                </ul>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-3 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-1.5 rounded-lg font-semibold hover:scale-105 transition text-sm"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center column */}
        <div className="col-span-12 md:col-span-6 space-y-4">
          {/* Application Insights */}
          <div className="col-span-12 md:col-span-6 bg-white/40 p-6 rounded-xl shadow-xl backdrop-blur-lg border border-white/20">
            <div className="mb-4">
              <h4 className="font-semibold text-blue-900 text-lg mb-1.5">
                Application Insights
              </h4>
              <div className="h-1 w-12 bg-blue-200 rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div className="bg-white/30 p-3 rounded-lg border border-white/20">
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {totalApplied}
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  Jobs Applied
                </p>
              </div>
              <div className="bg-white/30 p-3 rounded-lg border border-white/20">
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {totalResponded}
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  Jobs Responded
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-800 space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-white/30">
                <span className="font-medium text-blue-900">This Week:</span>
                <span className="font-semibold">
                  {applicationsThisWeek.length} applications
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/30">
                <span className="font-medium text-blue-900">This Month:</span>
                <span className="font-semibold">
                  {applicationsThisMonth.length} applications
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">
                  Most Applied Job:
                </span>
                <span className="font-semibold">{mostAppliedCategory}</span>
              </div>
            </div>
          </div>

          <div className="mt-3"></div>

          <div className="col-span-12 md:col-span-6 bg-white/40 p-6 rounded-xl shadow-xl backdrop-blur-lg border border-white/20">
            {/* max-h-84 overflow-y-auto pr-2 scrollbar-hide */}
            <h4 className="font-semibold text-blue-900 text-lg mb-3">
              Recent Applications
            </h4>
            <div className="h-1 w-12 bg-blue-200 rounded-full"></div>

            {recentApplications.length === 0 ? (
              <p className="text-sm text-gray-600">No recent applications</p>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app, idx) => {
                  const statusOrder = {
                    applied: 1,
                    pending: 1,
                    reviewed: 2,
                    "under review": 2,
                    interview_scheduled: 3,
                    hired: 4,
                    rejected: 4,
                  };

                  const currentStage =
                    statusOrder[
                      app.status.toLowerCase() as keyof typeof statusOrder
                    ] || 0;

                  return (
                    <div key={idx} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-blue-900">
                          {app.job?.title + " at " + app.job?.company ||
                            "Untitled Job"}
                        </span>
                        <span className="text-gray-500 capitalize">
                          {app.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                        <div
                          className={`absolute top-3 left-0 h-1 ${currentStage >= 1 ? "bg-blue-500" : "bg-gray-200"} z-10`}
                          style={{ width: `${(currentStage / 4) * 100}%` }}
                        ></div>

                        {/* Timeline dots */}
                        {["Applied", "Reviewed", "Interview", "Decision"].map(
                          (stage, index) => {
                            const stageNumber = index + 1;
                            const isCompleted = currentStage >= stageNumber;
                            const isCurrent = currentStage === stageNumber;

                            return (
                              <div
                                key={index}
                                className="flex flex-col items-center z-20"
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center 
                        ${isCompleted ? "bg-blue-500" : "bg-gray-200"}
                        ${isCurrent ? "ring-2 ring-blue-300" : ""}`}
                                >
                                  {isCompleted ? (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  ) : (
                                    <span className="text-xs text-gray-600">
                                      {stageNumber}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-xs mt-1 ${isCompleted ? "text-blue-700 font-medium" : "text-gray-500"}`}
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

        {/* Right Column */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-white/40 p-6 rounded-xl shadow-lg backdrop-blur-lg border border-white/20 text-center">
            <img
              src={
                user.imageUrl
                  ? `${user.imageUrl}`
                  : "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
              }
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-4 border-white shadow"
            />

            <h3 className="font-semibold text-blue-900">{user.fullName}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <button
              onClick={() => setIsEditOpen(true)}
              className="mt-4 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
            >
              Edit Profile
            </button>
          </div>
          {isEditOpen && (
            <EditProfileModal
              user={user}
              onClose={() => setIsEditOpen(false)}
              onSave={handleUserSave}
            />
          )}
          <div className="bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20">
            <h4 className="font-semibold text-blue-800 mb-2">
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
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Your profile is {percentage}% complete
                  </p>
                  {suggestions.length > 0 && (
                    <ul className="list-disc list-inside text-red-700 space-y-1">
                      {suggestions.map((sug, idx) => (
                        <li key={idx}>{sug}</li>
                      ))}
                    </ul>
                  )}
                  {suggestions.length === 0 && (
                    <p className="text-green-700">Profile is complete!</p>
                  )}
                </>
              );
            })()}
          </div>

          <PremiumPaymentModal
            jobSeekerId={user?.jobSeekerId}
            show={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
          />

          {/* <div className="bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20">
            <ResumeView />
          </div> */}
        </div>
      </div>
    </div>
  );
}
