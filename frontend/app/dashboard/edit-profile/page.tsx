"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaFilePdf, FaImage, FaUserCircle } from "react-icons/fa";
import {
  MdClose,
  MdOutlineCloudUpload,
  MdVisibility,
  MdSave,
} from "react-icons/md";

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
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

    const token = localStorage.getItem("token");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "File upload failed");
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
      setError((err as Error).message || "File upload failed");
    }
  }

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

  const getResumeFileName = (url: string | undefined): string => {
    if (!url) return "No file selected";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg shadow-2xl transform scale-95 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <MdClose size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h3>

        {error && (
          <p className="mb-4 text-red-600 text-center bg-red-100 p-2 rounded-lg text-sm">
            {error}
          </p>
        )}

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg group">
            <img
              src={
                formData.imageUrl ||
                "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
              }
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              title="Upload new image"
            >
              <MdOutlineCloudUpload className="text-white" size={36} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              className="hidden"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Click to change profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="e.g., +1234567890"
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume (PDF)
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition"
              >
                <MdOutlineCloudUpload size={18} /> Choose File
              </button>
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "resumeUrl")}
                className="hidden"
              />
              {formData.resumeUrl && (
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <FaFilePdf className="text-red-500" size={18} />
                  <span className="truncate max-w-[120px]">
                    {getResumeFileName(formData.resumeUrl)}
                  </span>
                  <a
                    href={formData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="View Resume"
                  >
                    <MdVisibility size={20} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Saving...
                </>
              ) : (
                <>
                  <MdSave size={18} /> Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
