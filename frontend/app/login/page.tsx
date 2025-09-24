// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// export default function LoginModal({ onClose }: { onClose: () => void }) {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotPopup, setForgotPopup] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("token", data.accessToken);
//       toast.success("Login successful!");
//       onClose();
//       router.push("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message, { id: "login-error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     try {
//       const res = await fetch(
//         "http://localhost:3000/job-seekers/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: forgotEmail }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send reset code");

//       toast.success("Reset link/code sent to your email.", {
//         id: "forgot-sent",
//       });
//     } catch (err: any) {
//       toast.error(err.message, { id: "forgot-failed" });
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <Toaster position="top-center" />
//       <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-blue-100 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <FaTimes />
//         </button>

//         <h3 className="text-2xl font-bold text-blue-800 text-center mb-6">
//           Welcome Back!
//         </h3>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <InputField
//             icon={<FaEnvelope />}
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <InputField
//             icon={<FaLock />}
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//           />

//           <div className="text-right text-sm">
//             <button
//               type="button"
//               onClick={() => setForgotPopup(true)}
//               className="text-blue-700 hover:underline cursor:pointer"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2.5 text-lg rounded-xl font-semibold transition-transform shadow ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed text-white"
//                 : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:scale-105"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* Forgot Password Popup */}
//         {forgotPopup && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//             <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-blue-100">
//               <h3 className="text-xl font-bold mb-4 text-center text-blue-800">
//                 Reset Your Password
//               </h3>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={forgotEmail}
//                 onChange={(e) => setForgotEmail(e.target.value)}
//                 className="w-full mb-4 p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <div className="flex justify-between">
//                 <button
//                   onClick={handleForgotPassword}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Send Code
//                 </button>
//                 <button
//                   onClick={() => setForgotPopup(false)}
//                   className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function InputField({ icon, ...props }: any) {
//   return (
//     <div className="flex items-center gap-2 bg-white/40 p-3 rounded-lg shadow-inner border border-white/20">
//       <div className="text-gray-800">{icon}</div>
//       <input
//         {...props}
//         className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-500"
//       />
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { MdOutlineSend, MdLogin } from "react-icons/md";

// export default function LoginModal({ onClose }: { onClose: () => void }) {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotPopup, setForgotPopup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [sendingForgotEmail, setSendingForgotEmail] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("token", data.accessToken);
//       toast.success("Login successful!");
//       onClose();
//       router.push("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "login-error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     setSendingForgotEmail(true);
//     try {
//       const res = await fetch(
//         "http://localhost:3000/job-seekers/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: forgotEmail }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send reset link");

//       toast.success("Password reset link sent to your email.", {
//         id: "forgot-sent",
//       });
//       setForgotPopup(false);
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "forgot-failed",
//       });
//     } finally {
//       setSendingForgotEmail(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300"
//       onClick={onClose}
//     >
//       <Toaster position="top-center" />
//       <div
//         className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-blue-100 relative transform scale-95 transition-transform duration-300"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
//           title="Close"
//         >
//           <FaTimes size={20} />
//         </button>

//         <h3 className="text-3xl font-bold text-blue-800 text-center mb-6">
//           Welcome Back!
//         </h3>

//         <form onSubmit={handleLogin} className="space-y-5">
//           <InputField
//             icon={<FaEnvelope />}
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <InputField
//             icon={<FaLock />}
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//           />

//           <div className="text-right text-sm">
//             <button
//               type="button"
//               onClick={() => setForgotPopup(true)}
//               className="text-blue-700 hover:text-blue-900 hover:underline transition-colors"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                 : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-[1.02]"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Logging in...
//               </>
//             ) : (
//               <>
//                 <MdLogin size={20} /> Login
//               </>
//             )}
//           </button>
//         </form>

//         {/* Forgot Password Popup */}
//         {forgotPopup && (
//           <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center p-4 rounded-3xl">
//             <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 w-full">
//               <h4 className="text-xl font-bold mb-4 text-center text-blue-800">
//                 Reset Password
//               </h4>
//               <p className="text-center text-sm text-gray-600 mb-4">
//                 Enter your email to receive a password reset link.
//               </p>
//               <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
//                 <FaEnvelope className="text-gray-500" />
//                 <input
//                   type="email"
//                   placeholder="Email address"
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                   className="w-full outline-none"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setForgotPopup(false)}
//                   className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
//                   disabled={sendingForgotEmail}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleForgotPassword}
//                   disabled={sendingForgotEmail}
//                   className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
//                     sendingForgotEmail
//                       ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                       : "bg-blue-600 text-white hover:bg-blue-700 transition"
//                   }`}
//                 >
//                   {sendingForgotEmail ? (
//                     <>
//                       <svg
//                         className="animate-spin h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <MdOutlineSend size={18} /> Send
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function InputField({ icon, ...props }: any) {
//   return (
//     <div className="flex items-center gap-3 bg-white/40 p-4 rounded-xl shadow-inner border border-white/30">
//       <div className="text-blue-600">{icon}</div>
//       <input
//         {...props}
//         className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-500"
//       />
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { MdOutlineSend, MdLogin } from "react-icons/md";

// export default function LoginModal({ onClose }: { onClose: () => void }) {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotPopup, setForgotPopup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [sendingForgotEmail, setSendingForgotEmail] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("token", data.accessToken);
//       toast.success("Login successful!");
//       onClose();
//       router.push("/dashboard");
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "login-error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     setSendingForgotEmail(true);
//     try {
//       const res = await fetch(
//         "http://localhost:3000/job-seekers/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: forgotEmail }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send reset link");

//       toast.success("Password reset link sent to your email.", {
//         id: "forgot-sent",
//       });
//       setForgotPopup(false);
//     } catch (err: any) {
//       toast.error(err.message || "An unexpected error occurred", {
//         id: "forgot-failed",
//       });
//     } finally {
//       setSendingForgotEmail(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-500"
//       onClick={onClose}
//     >
//       <Toaster position="top-center" />
//       <div
//         className="bg-white/95 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-blue-200 relative transform transition-all duration-500 hover:scale-[1.02]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
//           title="Close"
//         >
//           <FaTimes size={24} />
//         </button>

//         <h3 className="text-4xl font-extrabold text-blue-900 text-center mb-8">
//           Sign In
//         </h3>

//         <form onSubmit={handleLogin} className="space-y-6">
//           <InputField
//             icon={<FaEnvelope />}
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <InputField
//             icon={<FaLock />}
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//           />

//           <div className="text-right text-sm">
//             <button
//               type="button"
//               onClick={() => setForgotPopup(true)}
//               className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
//               loading
//                 ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                 : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:shadow-xl hover:scale-[1.03]"
//             }`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5 text-gray-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Signing in...
//               </>
//             ) : (
//               <>
//                 <MdLogin size={22} /> Sign In
//               </>
//             )}
//           </button>
//         </form>

//         {/* Forgot Password Popup */}
//         {forgotPopup && (
//           <div className="absolute inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center p-6 rounded-3xl transition-all duration-300">
//             <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-sm">
//               <h4 className="text-2xl font-bold mb-5 text-center text-blue-900">
//                 Reset Password
//               </h4>
//               <p className="text-center text-sm text-gray-600 mb-5">
//                 Enter your email to receive a password reset link.
//               </p>
//               <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
//                 <FaEnvelope className="text-blue-600" />
//                 <input
//                   type="email"
//                   placeholder="Email address"
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                   className="w-full outline-none text-gray-800 placeholder:text-gray-400"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   onClick={() => setForgotPopup(false)}
//                   className="px-5 py-2.5 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                   disabled={sendingForgotEmail}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleForgotPassword}
//                   disabled={sendingForgotEmail}
//                   className={`px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 ${
//                     sendingForgotEmail
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-md transition-all duration-200"
//                   }`}
//                 >
//                   {sendingForgotEmail ? (
//                     <>
//                       <svg
//                         className="animate-spin h-5 w-5 text-gray-600"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <MdOutlineSend size={20} /> Send
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
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
//         className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-400"
//       />
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdOutlineSend, MdLogin } from "react-icons/md";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPopup, setForgotPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingForgotEmail, setSendingForgotEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
      toast.error(err.message || "An unexpected error occurred", {
        id: "login-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setSendingForgotEmail(true);
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
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");

      toast.success("Password reset link sent to your email.", {
        id: "forgot-sent",
      });
      setForgotPopup(false);
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred", {
        id: "forgot-failed",
      });
    } finally {
      setSendingForgotEmail(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-500"
      onClick={onClose}
    >
      <Toaster position="top-center" />
      <div
        className="bg-white/95 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-blue-200 relative transform transition-all duration-500 hover:scale-[1.02]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
          title="Close"
        >
          <FaTimes size={24} />
        </button>

        <h3 className="text-4xl font-extrabold text-blue-900 text-center mb-8">
          Sign In
        </h3>

        <form onSubmit={handleLogin} className="space-y-6">
          <InputField
            icon={<FaEnvelope />}
            type="email"
            name="email"
            placeholder="Email Address"
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
            showToggle
          />

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => setForgotPopup(true)}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 text-lg rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${
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
                Signing in...
              </>
            ) : (
              <>
                <MdLogin size={22} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Popup */}
        {forgotPopup && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center p-6 rounded-3xl transition-all duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 w-full max-w-sm">
              <h4 className="text-2xl font-bold mb-5 text-center text-blue-900">
                Reset Password
              </h4>
              <p className="text-center text-sm text-gray-600 mb-5">
                Enter your email to receive a password reset link.
              </p>
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
                <FaEnvelope className="text-blue-600" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForgotEmail(e.target.value)
                  }
                  className="w-full outline-none text-gray-800 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setForgotPopup(false)}
                  className="px-5 py-2.5 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  disabled={sendingForgotEmail}
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={sendingForgotEmail}
                  className={`px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 ${
                    sendingForgotEmail
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-md transition-all duration-200"
                  }`}
                >
                  {sendingForgotEmail ? (
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
                      <MdOutlineSend size={20} /> Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
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
        className="bg-transparent w-full outline-none text-gray-900 placeholder:text-gray-400"
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
