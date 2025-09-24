"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

type User = {
  jobSeekerId: number;
  fullName: string;
  email: string;
  phone?: string;
};

type Props = {
  jobSeekerId?: number;
  user?: User; // ✅ user prop
  show: boolean;
  onClose: () => void;
};

export default function PremiumPaymentModal({
  jobSeekerId,
  user,
  show,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!show) return null;
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
          <p className="text-center text-red-500">
            User information not available.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token"); // JWT still needed
      if (!token) {
        toast.error("You must be logged in to pay.");
        return;
      }

      const paymentData = {
        jobSeekerId: jobSeekerId || user.jobSeekerId,
        amount: 500, // Example amount
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: "Dhaka",
      };

      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/payment/initiate",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ attach JWT
          },
        }
      );

      const { GatewayPageURL } = response.data;

      if (GatewayPageURL) {
        window.location.href = GatewayPageURL;
      } else {
        toast.error("Payment initiation failed.");
      }
    } catch (err: any) {
      console.error(
        "Payment initiation error:",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message || "Error while initiating payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-80 shadow-lg relative">
          <h3 className="text-xl font-semibold mb-4">Upgrade to Premium</h3>
          <p className="text-sm text-gray-600 mb-6">
            Enjoy exclusive jobs, priority review, and more benefits.
          </p>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md text-white ${
              loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Processing..." : "Pay 500 BDT"}
          </button>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
