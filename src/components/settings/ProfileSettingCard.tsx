import { ICONS } from "@agensy/constants";
import { Card, EditProfileSettingsModal } from "@agensy/components";
import { useAuthContext } from "@agensy/context";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "@agensy/utils";
import {
  useUpdateProfileAvatarMutation,
  useUpdateProfileMutation,
} from "@agensy/api";
import { PuffLoader } from "react-spinners";
import type { IUser, ProfileFormData } from "@agensy/types";

export const ProfileSettingCard: React.FC = () => {
  const { userData, updateUserData, file, setFile } = useAuthContext();
  const updateUserAvatarMutation = useUpdateProfileAvatarMutation();
  const updateUserMutation = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] =
    useState<boolean>(false);

  const handleImageClick = () => {
    if (!updateUserAvatarMutation.isPending) fileInputRef.current?.click();
  };

  useEffect(() => {
    if (updateUserAvatarMutation.status === "success") {
      toast.success("Avatar updated successfully");
      updateUserData(updateUserAvatarMutation.data);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (updateUserAvatarMutation.status === "error") {
      toast.error(
        "Failed to update avatar",
        String(updateUserAvatarMutation.error)
      );
      setFile(null);
    }
  }, [updateUserAvatarMutation.status]);

  useEffect(() => {
    if (updateUserMutation.status === "success") {
      setIsProfileEditModalOpen(false);
      toast.success("Profile updated successfully");
      updateUserData(updateUserMutation.data);
    } else if (updateUserMutation.status === "error") {
      toast.error("Failed to update profile", String(updateUserMutation.error));
    }
  }, [updateUserMutation.status]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error("Image size must be less than 2MB");
      return;
    }

    if (file.type.startsWith("image/")) {
      setFile(file);
      const formData = new FormData();
      formData.append("file", file);
      updateUserAvatarMutation.mutate(formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const handleSubmit = (data: ProfileFormData) => {
    updateUserMutation.mutate(data);
  };

  return (
    <React.Fragment>
      <Card
        title="Profile Settings"
        buttonText={<ICONS.edit size={16} />}
        ariaLabel="Edit Profile"
        onButtonClick={() => setIsProfileEditModalOpen(true)}
      >
        <div className="flex flex-col items-center md:items-start md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden">
                {userData?.avatar ? (
                  <img
                    src={file ? URL.createObjectURL(file) : userData.avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primaryColor to-basicBlue text-white text-3xl font-medium flex items-center justify-center">
                    {(userData?.first_name?.[0]?.toUpperCase() || "") +
                      (userData?.last_name?.[0]?.toUpperCase() || "")}
                  </div>
                )}
                {updateUserAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center rounded-full justify-center">
                    <PuffLoader color="#fff" size={24} />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleImageClick}
              disabled={updateUserAvatarMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ICONS.edit size={16} />
              <span className="text-sm font-medium">
                {updateUserAvatarMutation.isPending
                  ? "Uploading..."
                  : "Edit Photo"}
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">First Name</label>
                <div className="flex items-center gap-3 p-2 bg-lightGray rounded-xl">
                  <ICONS.user size={18} className="text-gray-500" />
                  <p className="text-darkGray">
                    {userData?.first_name || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Last Name</label>
                <div className="flex items-center gap-3 p-2 bg-lightGray rounded-xl">
                  <ICONS.user size={18} className="text-gray-500" />
                  <p className="text-darkGray">
                    {userData?.last_name || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Email</label>
              <div className="flex items-center gap-3 p-2 bg-lightGray rounded-xl">
                <ICONS.mail size={18} className="text-gray-500" />
                <p className="text-darkGray">
                  {userData?.email || "Not provided"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Phone</label>
              <div className="flex items-center gap-3 p-2 bg-lightGray rounded-xl">
                <ICONS.phone size={18} className="text-gray-500" />
                <p className="text-darkGray">
                  {userData?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <EditProfileSettingsModal
        isOpen={isProfileEditModalOpen}
        onClose={() => setIsProfileEditModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={updateUserMutation.isPending}
        initialData={userData as IUser}
      />
    </React.Fragment>
  );
};

export default ProfileSettingCard;
