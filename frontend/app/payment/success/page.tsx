"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const SuccessPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const tranId = params.get("tran_id");

  useEffect(() => {
    if (!tranId) return;

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/payment/success?tran_id=${tranId}`
        );
        const data = await response.json();

        if (data.success) {
          toast.success("Successfully paid. You are now a premium member!");

          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          toast.error(
            data.message || "Payment verification failed. Contact support."
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Error verifying payment! Please try again later.");
      }
    };

    verifyPayment();
  }, [tranId, router]);

  return (
    <div className="text-center mt-20">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-green-600">
        Processing Payment...
      </h1>
      <p>Please wait while we verify your payment.</p>
    </div>
  );
};

export default SuccessPage;
