import { OCRService } from "@agensy/services";
import { useMutation } from "@tanstack/react-query";

export const useOCRScanMutation = () => {
  return useMutation({
    mutationFn: ({ data }: { data: unknown }) =>
      OCRService.postScanDocument(data),
  });
};
