"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: { id: number; message: string; time: string }[];
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-1 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-600"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold text-blue-800 mb-4">Notifications</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white/50 rounded-lg shadow border border-white/20"
              >
                <p className="text-sm text-gray-800">{note.message}</p>
                <p className="text-xs text-gray-500 mt-1">{note.time}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
