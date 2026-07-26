import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoginAuth from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => LoginAuth({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      navigate("/dashboard", { replace: true });
    },
    onError: () => {
      toast.error("Entered email or password is incorrect!");
    },
  });
  return { login, isLoading };
}
