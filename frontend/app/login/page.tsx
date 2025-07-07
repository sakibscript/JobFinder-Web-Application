"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPopup, setForgotPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/job-seekers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.accessToken);
      toast.success("Login successful!");
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message, { id: "login-error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/job-seekers/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset code");

      toast.success("Reset link/code sent to your email.", {
        id: "forgot-sent",
      });
    } catch (err: any) {
      toast.error(err.message, { id: "forgot-failed" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Toaster position="top-center" />
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h3 className="text-2xl font-bold text-blue-800 text-center mb-6">
          Welcome Back!
        </h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            icon={<FaEnvelope />}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            icon={<FaLock />}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => setForgotPopup(true)}
              className="text-blue-700 hover:underline cursor:pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 text-lg rounded-xl font-semibold transition-transform shadow ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:scale-105"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password Popup */}
        {forgotPopup && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-blue-100">
              <h3 className="text-xl font-bold mb-4 text-center text-blue-800">
                Reset Your Password
              </h3>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full mb-4 p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleForgotPassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Send Code
                </button>
                <button
                  onClick={() => setForgotPopup(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ icon, ...props }: any) {
  return (
    <div className="flex items-center gap-2 bg-white/40 p-3 rounded-lg shadow-inner border border-white/20">
      <div className="text-gray-800">{icon}</div>
      <input
        {...props}
        className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-500"
      />
    </div>
  );
}
