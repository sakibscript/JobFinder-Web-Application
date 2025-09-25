"use client";

import React, { JSX, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCrown,
  FaCheck,
  FaTimes,
  FaLock,
  FaShieldAlt,
  FaRocket,
  FaStar,
  FaClock,
  FaUserTie,
  FaEye,
  FaBolt,
  FaCreditCard,
  FaSpinner,
} from "react-icons/fa";

type User = {
  jobSeekerId: number;
  fullName: string;
  email: string;
  phone?: string;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  icon: JSX.Element;
  color: string;
};

type Props = {
  jobSeekerId?: number;
  user?: User;
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
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");

  const plans: Plan[] = [
    {
      id: "monthly",
      name: "Premium Monthly",
      price: 299,
      duration: "month",
      features: [
        "Priority job applications",
        "Advanced profile visibility",
        "5 featured applications per month",
        "Basic analytics dashboard",
        "Email support",
      ],
      icon: <FaStar className="text-yellow-500" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "annual",
      name: "Premium Annual",
      price: 2500,
      duration: "year",
      features: [
        "Everything in Monthly plan",
        "Unlimited featured applications",
        "Top priority in employer searches",
        "Advanced analytics dashboard",
        "Dedicated career consultant",
        "24/7 phone support",
        "Resume review service",
      ],
      popular: true,
      icon: <FaCrown className="text-yellow-400" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "lifetime",
      name: "Lifetime Access",
      price: 5000,
      duration: "lifetime",
      features: [
        "All Annual plan features",
        "One-time payment",
        "Lifetime premium status",
        "Exclusive job invitations",
        "VIP employer networking",
        "Personal career coach",
        "Early access to new features",
      ],
      icon: <FaRocket className="text-green-500" />,
      color: "from-green-500 to-teal-600",
    },
  ];

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

  if (!show) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimes className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Access Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please log in to upgrade to premium.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to upgrade to premium.");
        return;
      }

      setLoading(true);

      const paymentData = {
        jobSeekerId: jobSeekerId || user.jobSeekerId,
        amount: selectedPlanData?.price || 500,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: "Dhaka",
        plan: selectedPlan,
        paymentMethod: paymentMethod,
      };

      const response = await axios.post(
        "http://localhost:3000/payment/initiate",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      const { GatewayPageURL, paymentId } = response.data;

      if (GatewayPageURL) {
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            paymentId,
            plan: selectedPlan,
            amount: selectedPlanData?.price,
          })
        );

        window.location.href = GatewayPageURL;
      } else {
        toast.error("Payment initiation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
          "Error while initiating payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (plan: Plan) => {
    if (plan.id === "annual") {
      const monthlyCost = 299 * 12;
      const savings = monthlyCost - plan.price;
      const percentage = Math.round((savings / monthlyCost) * 100);
      return { savings, percentage };
    }
    return null;
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <FaCrown className="text-yellow-300 text-2xl" />
                  <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                </div>
                <p className="text-purple-100">
                  Unlock exclusive features and accelerate your career growth
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-xl transition-colors duration-200 p-2"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8 max-h-[70vh] overflow-y-auto">
            {/* Plan Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Your Plan
              </h3>
              <div className="space-y-4">
                {plans.map((plan) => {
                  const savings = calculateSavings(plan);
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? `border-transparent bg-gradient-to-r ${plan.color} text-white shadow-lg transform scale-105`
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            MOST POPULAR
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              selectedPlan === plan.id
                                ? "bg-white/20"
                                : "bg-gray-100"
                            }`}
                          >
                            {plan.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{plan.name}</h4>
                            <p
                              className={`text-sm ${
                                selectedPlan === plan.id
                                  ? "text-white/90"
                                  : "text-gray-600"
                              }`}
                            >
                              Billed per {plan.duration}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ৳{plan.price}
                          </div>
                          {savings && (
                            <div className="text-sm text-green-600 font-medium">
                              Save ৳{savings.savings} ({savings.percentage}%)
                            </div>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <FaCheck
                              className={`mr-2 flex-shrink-0 ${
                                selectedPlan === plan.id
                                  ? "text-white"
                                  : "text-green-500"
                              }`}
                              size={12}
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Details
              </h3>

              {/* User Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FaUserTie className="mr-2 text-blue-500" />
                  Account Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium text-purple-600">
                      {selectedPlanData?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              {/* <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FaCreditCard className="mr-2 text-blue-500" />
                  Payment Method
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FaCreditCard
                        className={
                          paymentMethod === "card"
                            ? "text-blue-500"
                            : "text-gray-400"
                        }
                      />
                      <span className="font-medium">Credit Card</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mobile")}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      paymentMethod === "mobile"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FaBolt
                        className={
                          paymentMethod === "mobile"
                            ? "text-green-500"
                            : "text-gray-400"
                        }
                      />
                      <span className="font-medium">Mobile Banking</span>
                    </div>
                  </button>
                </div>
              </div> */}

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span>{selectedPlanData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>1 {selectedPlanData?.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>৳{selectedPlanData?.price}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-lg">
                        ৳{selectedPlanData?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Payment Button */}
              <div className="space-y-4">
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <FaLock className="mr-2" />
                  <span>Your payment is secure and encrypted</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`cursor-pointer w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <FaCrown />
                      <span>Upgrade Now - ৳{selectedPlanData?.price}</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>

          {/* Features Highlight */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-center mb-4">
              Why Go Premium?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <FaEye className="text-blue-500 text-xl mb-2" />
                <span className="text-sm font-medium">5x More Visibility</span>
              </div>
              <div className="flex flex-col items-center">
                <FaBolt className="text-yellow-500 text-xl mb-2" />
                <span className="text-sm font-medium">
                  Priority Applications
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaShieldAlt className="text-green-500 text-xl mb-2" />
                <span className="text-sm font-medium">Verified Profile</span>
              </div>
              <div className="flex flex-col items-center">
                <FaUserTie className="text-purple-500 text-xl mb-2" />
                <span className="text-sm font-medium">Career Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
