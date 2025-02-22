import { toast } from "vue3-toastify";

export function showToastSuccess(message: string) {
  toast.success(message, {
    autoClose: 3000,
    position: "top-right",
    theme: "colored",
  });
}

export function showToastError(message: string) {
  toast.error(message, {
    autoClose: 3000,
    position: "top-right",
    theme: "colored",
  });
}
