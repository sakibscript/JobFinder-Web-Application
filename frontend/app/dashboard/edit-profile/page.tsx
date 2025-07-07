// "use client";

// import React, { useState, useEffect } from "react";

// type User = {
//   jobSeekerId: number;
//   fullName: string;
//   email: string;
//   phone?: string;
//   resumeUrl?: string;
//   Role?: number;
//   imageUrl?: string;
//   isPremium: boolean;
//   expiresAt: string;
// };

// type Props = {
//   user: User;
//   onClose: () => void;
//   onSave: (updatedUser: User) => void;
// };

// export default function EditProfileModal({ user, onClose, onSave }: Props) {
//   const [formData, setFormData] = useState<User>(user);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setFormData(user);
//   }, [user]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }

//   async function uploadFile(
//     file: File,
//     url: string
//   ): Promise<{ filename: string }> {
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch(url, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       throw new Error("File upload failed");
//     }

//     return res.json();
//   }

//   async function handleResumeUpload(file: File) {
//     const res = await uploadFile(
//       file,
//       `/job-seekers/upload-resume/${formData.jobSeekerId}`
//     );
//     // res = { filename: string }
//     return `/uploads/resumes/${res.filename}`;
//   }

//   async function handleImageUpload(file: File) {
//     const res = await uploadFile(
//       file,
//       `/job-seekers/upload-image/${formData.jobSeekerId}`
//     );
//     return `/uploads/profile-images/${res.filename}`;
//   }

//   async function handleFileChange(
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: "image" | "resumeUrl"
//   ) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setError("");

//       if (field === "resumeUrl") {
//         if (file.type !== "application/pdf") {
//           setError("Please upload a PDF file.");
//           return;
//         }
//         const uploadedUrl = await handleResumeUpload(file);
//         setFormData((prev) => ({ ...prev, resumeUrl: uploadedUrl }));
//       } else if (field === "image") {
//         if (!file.type.startsWith("image/")) {
//           setError("Please upload an image file.");
//           return;
//         }
//         const uploadedUrl = await handleImageUpload(file);
//         setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
//       }
//     } catch (err) {
//       console.error(err);
//       setError("File upload failed");
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     if (!formData.fullName.trim() || !formData.email.trim()) {
//       setError("Full Name and Email are required");
//       return;
//     }

//     setSaving(true);
//     try {
//       // Call backend update profile API
//       const res = await fetch(`/job-seekers/${formData.jobSeekerId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           email: formData.email,
//           phone: formData.phone,
//           resumeUrl: formData.resumeUrl,
//           imageUrl: formData.imageUrl,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to save profile");
//       }

//       const updatedUser = await res.json();
//       onSave(updatedUser);
//       onClose();
//     } catch (err) {
//       setError((err as Error).message || "Failed to save profile");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white/90 backdrop-blur-lg rounded-xl p-6 w-full max-w-md shadow-xl relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-xl font-semibold text-center text-blue-900 mb-4">
//           Edit Profile
//         </h3>

//         {error && (
//           <p className="mb-3 text-red-600 text-sm text-center">{error}</p>
//         )}

//         {/* Profile Image Display */}
//         <div className="flex flex-col items-center mb-6">
//           <img
//             src={
//               formData.imageUrl ||
//               "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
//             }
//             alt="Profile Preview"
//             className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
//           />

//           <div className="mt-2 flex items-center gap-2">
//             <label className="px-3 py-1 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700 transition">
//               Choose Image
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange(e, "image")}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone || ""}
//               onChange={handleChange}
//               placeholder="+8801XXXXXXXXX"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Resume Upload */}
//           <div className="pt-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Resume (PDF)
//             </label>

//             <div className="flex items-center gap-2">
//               <label className="px-3 py-1 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700 transition">
//                 Choose Resume
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => handleFileChange(e, "resumeUrl")}
//                   className="hidden"
//                 />
//               </label>

//               {formData.resumeUrl && (
//                 <span className="text-sm text-gray-700 truncate max-w-[140px]">
//                   {formData.resumeUrl.split("/").pop()}
//                 </span>
//               )}
//             </div>

//             {formData.resumeUrl && (
//               <a
//                 href={formData.resumeUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block mt-1 text-blue-600 text-sm underline"
//               >
//                 View Resume
//               </a>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:scale-105 transition disabled:opacity-70"
//             >
//               {saving ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";

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

type Props = {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
};

export default function EditProfileModal({ user, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<User>(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(user);
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function uploadFile(
    file: File,
    url: string
  ): Promise<{ filename: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token"); // or use cookies/session
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("File upload failed");
    }

    return res.json();
  }

  async function handleResumeUpload(file: File) {
    const res = await uploadFile(
      file,
      `http://localhost:3000/job-seekers/upload-resume/${formData.jobSeekerId}`
    );
    return `http://localhost:3000/uploads/resumes/${res.filename}`;
  }

  async function handleImageUpload(file: File) {
    const res = await uploadFile(
      file,
      `http://localhost:3000/job-seekers/upload-image/${formData.jobSeekerId}`
    );
    return `http://localhost:3000/uploads/profile-images/${res.filename}`;
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "resumeUrl"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");

      if (field === "resumeUrl") {
        if (file.type !== "application/pdf") {
          setError("Please upload a PDF file.");
          return;
        }
        const uploadedUrl = await handleResumeUpload(file);
        setFormData((prev) => ({ ...prev, resumeUrl: uploadedUrl }));
      } else if (field === "image") {
        if (!file.type.startsWith("image/")) {
          setError("Please upload an image file.");
          return;
        }
        const uploadedUrl = await handleImageUpload(file);
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      }
    } catch (err) {
      console.error(err);
      setError("File upload failed");
    }
  }

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setError("");

  //   if (!formData.fullName.trim() || !formData.email.trim()) {
  //     setError("Full Name and Email are required");
  //     return;
  //   }

  //   setSaving(true);
  //   try {
  //     const res = await fetch(
  //       `http://localhost:3000/job-seekers/${formData.jobSeekerId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           fullName: formData.fullName,
  //           email: formData.email,
  //           phone: formData.phone,
  //           resumeUrl: formData.resumeUrl,
  //           imageUrl: formData.imageUrl,
  //         }),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Failed to save profile");
  //     }

  //     const updatedUser = await res.json();
  //     onSave(updatedUser);
  //     onClose();
  //   } catch (err) {
  //     setError((err as Error).message || "Failed to save profile");
  //   } finally {
  //     setSaving(false);
  //   }
  // }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Full Name and Email are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:3000/job-seekers/${formData.jobSeekerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            resumeUrl: formData.resumeUrl,
            imageUrl: formData.imageUrl,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Save failed:", errorText);
        throw new Error("Failed to save profile");
      }

      const updatedUser = await res.json();
      onSave(updatedUser);
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-lg rounded-xl p-6 w-full max-w-md shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-center text-blue-900 mb-4">
          Edit Profile
        </h3>

        {error && (
          <p className="mb-3 text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Profile Image Display */}
        <div className="flex flex-col items-center mb-6">
          {/* <img
            src={
              formData.imageUrl ||
              "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
            }
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          /> */}

          {/* <img
            src={
              formData.imageUrl
                ? formData.imageUrl.startsWith("http")
                  ? formData.imageUrl
                  : `http://localhost:3000${formData.imageUrl}`
                : "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
            }
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          /> */}
          <img
            src={
              formData.imageUrl
                ? formData.imageUrl.startsWith("http")
                  ? formData.imageUrl
                  : `http://localhost:3000/uploads/profile-images/${formData.imageUrl}`
                : "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
            }
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />

          <div className="mt-2 flex items-center gap-2">
            <label className="px-3 py-1 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700 transition">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Resume Upload */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume (PDF)
            </label>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1 bg-blue-600 text-white text-sm rounded cursor-pointer hover:bg-blue-700 transition">
                Choose Resume
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "resumeUrl")}
                  className="hidden"
                />
              </label>

              {formData.resumeUrl && (
                <span className="text-sm text-gray-700 truncate max-w-[140px]">
                  {formData.resumeUrl.split("/").pop()}
                </span>
              )}
            </div>

            {/* {formData.resumeUrl && (
              <a
                href={formData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-1 text-blue-600 text-sm underline"
              >
                View Resume
              </a>
            )} */}
            {/* {user.resumeUrl ? (
              <a
                href={`http://localhost:3000/uploads/resumes/${user.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            ) : (
              <p>No resume uploaded</p>
            )} */}
            {user.resumeUrl ? (
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            ) : (
              <p>No resume uploaded</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:scale-105 transition disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
