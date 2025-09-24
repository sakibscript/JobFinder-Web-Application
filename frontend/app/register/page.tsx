// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaPhone,
//   FaUserTag,
//   FaTimes,
// } from "react-icons/fa";
// import {
//   MdOutlineSend,
//   MdLogin,
//   MdOutlineCloudDone,
//   MdArrowBack,
// } from "react-icons/md";

// export default function RegistrationModal({
//   onClose,
// }: {
//   onClose: () => void;
// }) {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "JobSeeker",
//   });
//   const [step, setStep] = useState(1);
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sendingCode, setSendingCode] = useState(false);
//   const [codeVerified, setCodeVerified] = useState(false);
//   const router = useRouter();

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSendCode = async () => {
//     if (!formData.email) {
//       toast.error("Please enter your email first.", { id: "missing-email" });
//       return;
//     }

//     setSendingCode(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/send-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send code");

//       toast.success("Verification code sent to your email!", {
//         id: "code-sent",
//       });
//       setStep(2);
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "send-code-error",
//       });
//     } finally {
//       setSendingCode(false);
//     }
//   };

//   const handleVerifyCode = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/verify-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email, code }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Invalid code");

//       toast.success("Email verified!", { id: "code-verified" });
//       setCodeVerified(true);
//       setStep(3);
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "verify-code-error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         if (data.message && typeof data.message === "object") {
//           Object.entries(data.message).forEach(([field, msg]: any) => {
//             toast.error(`${field}: ${msg}`);
//           });
//         } else {
//           throw new Error(data.message || "Registration failed");
//         }
//         return;
//       }

//       toast.success("Registration successful!", { id: "register-success" });
//       onClose();
//       router.push("/login");
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "register-error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-500"
//       onClick={onClose}
//     >
//       <Toaster position="top-center" />
//       <div
//         className="bg-white/95 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-blue-200 relative transform transition-all duration-500 hover:scale-[1.02]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
//           title="Close"
//         >
//           <FaTimes size={24} />
//         </button>

//         {step === 1 && (
//           <>
//             <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-3">
//               Join <span className="text-blue-600">JobFinder</span>
//             </h2>
//             <p className="text-center text-gray-600 mb-8 text-sm">
//               Verify your email
//             </p>

//             <div className="space-y-6">
//               <InputField
//                 icon={<FaEnvelope />}
//                 type="email"
//                 name="email"
//                 placeholder="Email Address*"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               onClick={handleSendCode}
//               disabled={sendingCode}
//               className={`w-full mt-8 py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
//                 sendingCode
//                   ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                   : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
//               }`}
//             >
//               {sendingCode ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-gray-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <MdOutlineSend size={22} /> Send Code
//                 </>
//               )}
//             </button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-3">
//               Verify Your Email
//             </h2>
//             <p className="text-center text-gray-600 mb-8 text-sm">
//               Enter the code sent to <strong>{formData.email}</strong>
//             </p>

//             <div className="space-y-6">
//               <InputField
//                 icon={<MdOutlineCloudDone />}
//                 type="text"
//                 name="code"
//                 placeholder="Verification Code*"
//                 value={code}
//                 onChange={(e: any) => setCode(e.target.value)}
//                 required
//               />
//             </div>

//             <button
//               onClick={handleVerifyCode}
//               disabled={loading}
//               className={`w-full mt-8 py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
//                 loading
//                   ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                   : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-gray-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Verifying...
//                 </>
//               ) : (
//                 <>
//                   <MdLogin size={22} /> Verify
//                 </>
//               )}
//             </button>
//           </>
//         )}

//         {step === 3 && (
//           <>
//             <button
//               onClick={() => setStep(1)}
//               className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
//               title="Go Back"
//             >
//               <MdArrowBack size={24} />
//             </button>
//             <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-3">
//               Complete Your Profile
//             </h2>
//             <p className="text-center text-gray-600 mb-8 text-sm">
//               Fill in your details
//             </p>

//             <div className="space-y-6">
//               <InputField
//                 icon={<FaEnvelope />}
//                 type="email"
//                 name="email"
//                 placeholder="Email Address*"
//                 value={formData.email}
//                 onChange={handleChange}
//                 disabled
//               />
//               <InputField
//                 icon={<FaUser />}
//                 type="text"
//                 name="fullName"
//                 placeholder="Full Name*"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 required
//               />
//               <InputField
//                 icon={<FaLock />}
//                 type="password"
//                 name="password"
//                 placeholder="Password*"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <InputField
//                 icon={<FaPhone />}
//                 type="text"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//               <div className="flex items-center gap-3 bg-white/50 p-4 rounded-xl shadow-inner border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
//                 <FaUserTag className="text-blue-600" />
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="bg-transparent w-full outline-none text-gray-900 appearance-none cursor-pointer"
//                 >
//                   <option className="text-gray-900" value="JobSeeker">
//                     Job Seeker
//                   </option>
//                   <option className="text-black" value="Admin">
//                     Admin
//                   </option>
//                   <option className="text-black" value="Employee">
//                     Employee
//                   </option>
//                   <option className="text-black" value="ContentManager">
//                     Content Manager
//                   </option>
//                 </select>
//               </div>
//             </div>

//             <button
//               onClick={handleRegister}
//               disabled={loading}
//               className={`w-full mt-8 py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
//                 loading
//                   ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                   : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-gray-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Registering...
//                 </>
//               ) : (
//                 <>
//                   <MdLogin size={22} /> Register
//                 </>
//               )}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function InputField({ icon, ...props }: any) {
//   return (
//     <div className="flex items-center gap-3 bg-white/50 p-4 rounded-xl shadow-inner border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
//       <div className="text-blue-600">{icon}</div>
//       <input
//         {...props}
//         className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
//       />
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserTag,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  MdOutlineSend,
  MdLogin,
  MdOutlineCloudDone,
  MdArrowBack,
} from "react-icons/md";

export default function RegistrationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "JobSeeker",
  });
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first.", { id: "missing-email" });
      return;
    }

    setSendingCode(true);
    try {
      const res = await fetch("http://localhost:3000/job-seekers/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");

      toast.success("Verification code sent to your email!", {
        id: "code-sent",
      });
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", {
        id: "send-code-error",
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/job-seekers/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code");

      toast.success("Email verified!", { id: "code-verified" });
      setCodeVerified(true);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", {
        id: "verify-code-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/job-seekers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message && typeof data.message === "object") {
          Object.entries(data.message).forEach(([field, msg]: any) => {
            toast.error(`${field}: ${msg}`);
          });
        } else {
          throw new Error(data.message || "Registration failed");
        }
        return;
      }

      toast.success("Registration successful!", { id: "register-success" });
      onClose();
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", {
        id: "register-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-500"
      onClick={onClose}
    >
      <Toaster position="top-center" />
      <div
        className="bg-white/95 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-blue-200 relative transform transition-all duration-500 hover:scale-[1.02]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
          title="Close"
        >
          <FaTimes size={24} />
        </button>

        {step === 1 && (
          <>
            <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-3">
              Join <span className="text-blue-600">JobFinder</span>
            </h2>
            <p className="text-center text-gray-600 mb-8 text-sm">
              Verify your email
            </p>

            <div className="space-y-6">
              <InputField
                icon={<FaEnvelope />}
                type="email"
                name="email"
                placeholder="Email Address*"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={sendingCode}
              className={`w-full mt-8 py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
                sendingCode
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
              }`}
            >
              {sendingCode ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <MdOutlineSend size={22} /> Send Code
                </>
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-3">
              Verify Your Email
            </h2>
            <p className="text-center text-gray-600 mb-8 text-sm">
              Enter the code sent to <strong>{formData.email}</strong>
            </p>

            <div className="space-y-6">
              <InputField
                icon={<MdOutlineCloudDone />}
                type="text"
                name="code"
                placeholder="Verification Code*"
                value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCode(e.target.value)
                }
                required
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className={`w-full mt-8 py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <MdLogin size={22} /> Verify
                </>
              )}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <button
              onClick={() => setStep(1)}
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
              title="Go Back"
            >
              <MdArrowBack size={24} />
            </button>
            <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-3">
              Complete Your Profile
            </h2>
            <p className="text-center text-gray-600 mb-8 text-sm">
              Fill in your details
            </p>

            <div className="space-y-6">
              <InputField
                icon={<FaEnvelope />}
                type="email"
                name="email"
                placeholder="Email Address*"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
              <InputField
                icon={<FaUser />}
                type="text"
                name="fullName"
                placeholder="Full Name*"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <InputField
                icon={<FaLock />}
                type="password"
                name="password"
                placeholder="Password*"
                value={formData.password}
                onChange={handleChange}
                required
                showToggle
              />
              <InputField
                icon={<FaPhone />}
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <div className="flex items-center gap-3 bg-white/50 p-4 rounded-xl shadow-inner border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
                <FaUserTag className="text-blue-600" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none text-gray-900 appearance-none cursor-pointer"
                >
                  <option className="text-gray-900" value="JobSeeker">
                    Job Seeker
                  </option>
                  <option className="text-black" value="Admin">
                    Admin
                  </option>
                  <option className="text-black" value="Employee">
                    Employee
                  </option>
                  <option className="text-black" value="ContentManager">
                    Content Manager
                  </option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full mt-8 py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <MdLogin size={22} /> Register
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InputField({
  icon,
  showToggle = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  showToggle?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-white/50 p-4 rounded-xl shadow-inner border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
      <div className="text-blue-600">{icon}</div>
      <input
        {...props}
        type={showToggle && showPassword ? "text" : props.type}
        className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      )}
    </div>
  );
}
