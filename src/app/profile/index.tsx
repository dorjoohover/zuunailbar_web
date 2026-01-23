"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserLevel } from "@/lib/constants";
import { firstLetterUpper, mobileFormatter } from "@/lib/functions";
import { User, UserPassword } from "@/models";
import { Api, API } from "@/utils/api";
import { IdCard, KeyRound, Mail, Phone, UserCog, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { EditProfileModal } from "./edit";
import { create, updateOne } from "../(api)";
import { imageUploader } from "../(api)/base";
import { addToast } from "@heroui/toast";
import { ResetPasswordModal } from "./reset";
const levelConfig = {
  [UserLevel.GOLD]: {
    gradient: "bg-gradient-to-r from-[#FFD700] to-[#FFA500]",
    text: "Gold",
  },
  [UserLevel.SILVER]: {
    gradient: "bg-gradient-to-r from-[#C0C0C0] to-[#E0E0E0]",
    text: "Silver",
  },
  [UserLevel.BRONZE]: {
    gradient: "bg-gradient-to-r from-[#CD7F32] to-[#D89B6E]",
    text: "Bronze",
  },
};
export const ProfilePage = ({
  token,
  orders,
}: {
  orders?: number;
  token?: string;
}) => {
  const [user, setUser] = useState<User | undefined>();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const handleSaveProfile = async (data: User, file?: File) => {
    const { profile_img, ...body } = data;
    const formData = new FormData();
    let payload = { ...body, profile_img: undefined };
    if (file != null) {
      formData.append("files", file);
      const uploadResult = await imageUploader(formData);
      payload.profile_img = uploadResult[0];
    }
    const res = await updateOne(Api.user, data.id, payload);
    const success = res.success;
    addToast({
      title: `${success ? "Амжилттай солигдлоо." : "Дахин оролдоно уу."}`,
    });
    if (success) me();
  };
  const handleResetPassword = async (data: UserPassword) => {
    const { ...body } = data;
    let payload = { ...body };

    const res = await create(Api.resetPassword, payload);
    const success = res.success;
    addToast({
      title: `${success ? "Амжилттай солигдлоо." : (res.error ?? "Дахин оролдоно уу.")}`,
    });
    if (success) me();
  };
  const me = async () => {
    if (token) {
      try {
        console.log(token);
        const res = await fetch(`${API.user}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        const data = await res.json();
        if (data?.payload && data?.payload?.user) {
          setUser(data.payload.user);
        }
      } catch (error) {
        console.log("error", error);
        // deleteCookie();
      }
    }
  };
  useEffect(() => {
    me();
  }, [token]);
  if (!user) return;
  const config = levelConfig[(user.level as UserLevel) ?? UserLevel.BRONZE];
  const name = user.nickname ?? mobileFormatter(user.mobile ?? "");
  let phone = mobileFormatter(user.mobile ?? "");
  if (phone) phone = phone?.slice(0, 4) + "-" + phone?.slice(4);

  return (
    <div className="mt-20 max-w-[500px] mx-auto">
      <div className="w-full mb-8  rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center py-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={`/api/file/${user.profile_img}`} alt={name} />
          <AvatarFallback className="text-xs">
            {name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {user?.nickname && (
          <p className="text-md text-center">
            {firstLetterUpper(user.nickname)}
          </p>
        )}
        <p className="text-center text-sm text-gray-500 mb-4">{phone}</p>
        {/* <div
          className={`inline-flex items-center px-5 py-2 rounded-full ${config.gradient} shadow-sm`}
        >
          <span className="text-sm text-white">{config.text} Member</span>
        </div> */}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-900">Мэдээлэл</h3>
        </div>

        <div className="space-y-3  grid grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 rounded-lg p-2.5">
              <IdCard className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Овог нэр</p>
              <p className="text-sm text-gray-900">
                {(user.lastname ?? "")?.slice(0, 1)?.toUpperCase()}
                {user.lastname && "."}
                {firstLetterUpper(user.firstname ?? "")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 rounded-lg p-2.5">
              <UserPen className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Хоч</p>
              <p className="text-sm text-gray-900">
                {user.nickname ?? "Хоосон"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 rounded-lg p-2.5">
              <Phone className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Утасны дугаар</p>
              <p className="text-sm text-gray-900">{phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 rounded-lg p-2.5">
              <Mail className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Майл хаяг</p>
              <p className="text-sm text-gray-900">{user.mail ?? "Хоосон"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsReset(false);
              setIsEditModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4
      bg-gradient-to-r from-rose-500 to-rose-600
      text-white rounded-xl
      hover:from-rose-600 hover:to-rose-700
      transition-all duration-200 shadow-sm"
          >
            <UserCog className="w-4 h-4" />
            <span className="text-sm font-medium">Мэдээлэл засах</span>
          </button>

          <button
            onClick={() => {
              setIsReset(true);
              setIsEditModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4
      bg-gradient-to-r from-rose-600 to-rose-800
      text-white rounded-xl
      hover:from-rose-700 hover:to-rose-900
      transition-all duration-200 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span className="text-sm font-medium">Нууц үг солих</span>
          </button>
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl p-6 shadow-sm my-8">
        <h3 className="text-gray-900 mb-5">Товч мэдээлэл </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-5 text-center">
            <p className="text-3xl text-gray-900 mb-1">{orders}</p>
            <p className="text-xs text-gray-600">Нийт захиалга</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 text-center">
            <p className="text-3xl text-gray-900 mb-1">{config.text}</p>
            <p className="text-xs text-gray-600">Member Level</p>
          </div>
        </div>
      </div> */}

      {isReset ? (
        <ResetPasswordModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleResetPassword}
        />
      ) : (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={{
            ...user,
            mobile: mobileFormatter(user.mobile ?? ""),
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};
