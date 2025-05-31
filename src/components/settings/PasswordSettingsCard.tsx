import React, { useEffect, useState } from "react";
import { Card, EditPasswordSettingsModal } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useChangePasswordMutation } from "@agensy/api";
import type { PasswordFormData } from "@agensy/types";
import { DateUtils, toast } from "@agensy/utils";
import { useAuthContext } from "@agensy/context";

export const PasswordSettingsCard: React.FC = () => {
  const { userData } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const updatePasswordMutation = useChangePasswordMutation();

  useEffect(() => {
    if (updatePasswordMutation.status === "success") {
      setIsModalOpen(false);
      toast.success("Password updated successfully");
    } else if (updatePasswordMutation.status === "error") {
      toast.error(
        "Failed to update password",
        String(updatePasswordMutation.error)
      );
    }
  }, [updatePasswordMutation.status]);

  const onSubmit = (data: PasswordFormData) => {
    const postData = {
      oldPassword: data.current_password,
      newPassword: data.new_password,
    };
    updatePasswordMutation.mutate(postData);
  };

  return (
    <React.Fragment>
      <Card
        title="Password Settings"
        buttonText={<ICONS.edit size={16} />}
        ariaLabel="Edit Password"
        onButtonClick={() => setIsModalOpen(true)}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Current Password</label>
            <div className="flex items-center gap-3 p-2 bg-lightGray rounded-xl">
              <ICONS.password size={18} className="text-gray-500" />
              <p className="text-darkGray">••••••••</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Last Changed</label>
            <div className="flex items-center gap-3 p-2 bg-lightGray rounded-xl">
              <ICONS.calendar size={18} className="text-gray-500" />
              <p className="text-darkGray">
                {DateUtils.formatDateToRequiredFormat(
                  userData?.lastPassChangeDate || ""
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>
      <EditPasswordSettingsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSubmit={onSubmit}
        isLoading={updatePasswordMutation.isPending}
      />
    </React.Fragment>
  );
};

export default PasswordSettingsCard;
