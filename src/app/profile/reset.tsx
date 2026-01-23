import { useState } from "react";
import { X, Upload, EyeOff, Eye } from "lucide-react";
import { UserPassword } from "@/models";
import { addToast } from "@heroui/toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserPassword) => void;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserPassword>({
    newPassword: "",
    password: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newPassword) {
      addToast({ title: "Шинэ нууц үгээ оруулна уу.", color: "warning" });

      return;
    }
    if (!formData.repeatPassword) {
      addToast({
        title: "Шинэ нууц үгээ давтан оруулна уу.",
        color: "warning",
      });
      return;
    }
    if (!formData.password) {
      addToast({ title: "Одоогийн нууц үгээ оруулна уу.", color: "warning" });

      return;
    }
    if (formData.repeatPassword != formData.newPassword) {
      addToast({
        title: "Шинэ нууц үг болон давтан оруулсан нууц үг таарахгүй байна.",
        color: "warning",
      });
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-gray-900">Нууц үг солих</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Одоогийн нууц үг
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Шинэ нууц үг
            </label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Шинэ нууц үг давтах
            </label>

            <div className="relative">
              <input
                type={showRepeatPassword ? "text" : "password"}
                value={formData.repeatPassword}
                onChange={(e) =>
                  setFormData({ ...formData, repeatPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />

              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm"
            >
              Солих
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
