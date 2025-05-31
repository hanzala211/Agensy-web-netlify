import { notification } from "antd";

export const toast = {
  success: (messageText: string, description?: string) => {
    notification.success({
      message: messageText,
      description: description,
    });
  },
  error: (messageText: string, description?: string) => {
    notification.error({
      message: messageText,
      description: description,
    });
  },
  info: (messageText: string, description?: string) => {
    notification.info({
      message: messageText,
      description: description,
    });
  },
  warning: (messageText: string, description?: string) => {
    notification.warn({
      message: messageText,
      description: description,
    });
  },
};
