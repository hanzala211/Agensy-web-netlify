import React from "react";
import { PasswordSettingsCard, ProfileSettingCard } from "@agensy/components";
export const ProfileSettings: React.FC = () => {
  return (
    <div className="grid grid-rows-[auto,auto] gap-8 max-w-7xl mx-auto md:p-6">
      <ProfileSettingCard />
      <PasswordSettingsCard />
    </div>
  );
};

export default ProfileSettings;
