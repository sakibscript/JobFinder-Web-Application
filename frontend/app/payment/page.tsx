"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface PremiumPaymentModalProps {
  jobSeekerId: number;
  show: boolean;
  onClose: () => void;
}

const PremiumPaymentModal: React.FC<PremiumPaymentModalProps> = ({
  jobSeekerId,
  show,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobSeekerId,
          amount: 500,
        }),
      });

      const data = await res.json();

      if (data?.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        toast.error("Failed to initiate payment.");
        onClose();
      }
    } catch (error) {
      toast.error("Error initiating payment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    // <div className="fixed inset-0 z-50 bg-black bg-opacity-0 flex justify-center items-center">
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg space-y-4 relative">
        <h2 className="text-xl font-bold text-blue-800">Get Premium Access</h2>
        <p className="text-sm text-gray-700">
          Enjoy exclusive jobs, premium badges, webinars, and more.
        </p>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-blue-900 text-lg">৳500 BDT</span>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {loading ? "Redirecting..." : "Pay Now"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PremiumPaymentModal;
