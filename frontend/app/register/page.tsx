// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserTag } from "react-icons/fa";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "JobSeeker",
//   });
//   const [showCodePopup, setShowCodePopup] = useState(false);
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSendCode = async () => {
//     if (!formData.email) {
//       toast.error("Please enter your email first", { id: "missing-email" });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/send-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send code");

//       toast.success("Verification code sent!", { id: "code-sent" });
//       setShowCodePopup(true);
//     } catch (err: any) {
//       toast.error(err.message, { id: "send-code-error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/job-seekers/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, code }),
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
//       setShowCodePopup(false);
//       router.push("/login");
//     } catch (err: any) {
//       toast.error(err.message, { id: "register-error" });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200 flex items-center justify-center relative">
//       <Toaster position="top-center" />

//       <div className="absolute inset-0 bg-[url('/images/job-bg.jpg')] bg-cover bg-center opacity-10 blur-md" />

//       <div className="bg-white/30 backdrop-blur-xl shadow-xl p-10 rounded-3xl w-full max-w-lg z-10 border border-white/40">
//         <h2 className="text-4xl font-extrabold text-blue-800 text-center mb-6 drop-shadow-md">
//           Join <span className="text-blue-500">JobFinder</span>
//         </h2>

//         {/* Inputs */}
//         <div className="space-y-4">
//           <InputField
//             icon={<FaUser />}
//             type="text"
//             name="fullName"
//             placeholder="Full Name*"
//             value={formData.fullName}
//             onChange={handleChange}
//           />
//           <InputField
//             icon={<FaEnvelope />}
//             type="email"
//             name="email"
//             placeholder="Email*"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <InputField
//             icon={<FaLock />}
//             type="password"
//             name="password"
//             placeholder="Password*"
//             value={formData.password}
//             onChange={handleChange}
//           />
//           <InputField
//             icon={<FaPhone />}
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//           <div className="flex items-center gap-2 bg-white/40 p-3 rounded-lg shadow-inner border border-white/20">
//             <FaUserTag className="text-gray-800" />
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="bg-transparent w-full outline-none text-gray-900
//               placeholder-blue-400"
//             >
//               <option className="text-gray-900" value="JobSeeker">Job Seeker</option>
//               <option className="text-black" value="Admin">Admin</option>
//               <option className="text-black" value="Employee">Employee</option>
//               <option className="text-black" value="ContentManager">Content Manager</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={handleSendCode}
//           disabled={loading}
//           className={`w-full mt-6 py-3 text-lg rounded-xl font-semibold transition-transform shadow-lg ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed text-white"
//               : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:scale-105"
//           }`}
//         >
//           {loading ? "Sending..." : "Register"}
//         </button>

//         <p className="mt-4 text-blue-800 text-center">
//           Already have an account?{" "}
//           <Link href="/login" className="underline font-semibold hover:text-blue-500">
//             Back to Login
//           </Link>
//         </p>
//       </div>

//       {/* Code Popup */}
//       {showCodePopup && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-blue-100">
//             <h3 className="text-xl font-bold mb-4 text-center text-blue-800">Enter Verification Code</h3>
//             <input
//               type="text"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               placeholder="Enter code"
//               className="w-full p-3 border border-blue-200 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={handleRegister}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={() => setShowCodePopup(false)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // 🔹 Reusable input with icon
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

// components/RegistrationModal.tsx
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
} from "react-icons/fa";

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
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first", { id: "missing-email" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/job-seekers/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");

      toast.success("Verification code sent!", { id: "code-sent" });
      setShowCodePopup(true);
    } catch (err: any) {
      toast.error(err.message, { id: "send-code-error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3000/job-seekers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, code }),
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
      setShowCodePopup(false);
      onClose();
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message, { id: "register-error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Toaster position="top-center" />
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
          Join <span className="text-blue-500">JobFinder</span>
        </h2>

        {/* Inputs */}
        <div className="space-y-4">
          <InputField
            icon={<FaUser />}
            type="text"
            name="fullName"
            placeholder="Full Name*"
            value={formData.fullName}
            onChange={handleChange}
          />
          <InputField
            icon={<FaEnvelope />}
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            icon={<FaLock />}
            type="password"
            name="password"
            placeholder="Password*"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            icon={<FaPhone />}
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="flex items-center gap-2 bg-white/40 p-3 rounded-lg shadow-inner border border-white/20">
            <FaUserTag className="text-gray-800" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-transparent w-full outline-none text-gray-900 placeholder-blue-400"
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
          onClick={handleSendCode}
          disabled={loading}
          className={`w-full mt-6 py-2.5 text-lg rounded-xl font-semibold transition-transform shadow ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:scale-105"
          }`}
        >
          {loading ? "Sending..." : "Register"}
        </button>

        {/* Code Popup */}
        {showCodePopup && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-blue-100">
              <h3 className="text-xl font-bold mb-4 text-center text-blue-800">
                Enter Verification Code
              </h3>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="w-full p-3 border border-blue-200 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowCodePopup(false)}
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
