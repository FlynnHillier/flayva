import { toast } from "sonner";

export function useGlobalErrorToast() {
  const showGlobalErrorToast = (message: string) => {
    const toastID = toast.error(message);

    const dismiss = () => toast.dismiss(toastID);

    return { dismiss };
  };

  return { showErrorToast: showGlobalErrorToast };
}
