import { useMutation } from "@tanstack/react-query";
import { UserProfileSettingsService } from "@agensy/services";

export const useUpdateProfileAvatarMutation = () => {
  return useMutation({
    mutationFn: async (data: FormData) =>
      await UserProfileSettingsService.updateUserAvatar(data),
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async (data: unknown) =>
      await UserProfileSettingsService.updateUserProfile(data),
  });
};
