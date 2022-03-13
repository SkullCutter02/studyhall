import { useRouter } from "next/router";
import { useState } from "react";

import LoginFormInput from "../types/loginFormInput.interface";
import { axios } from "../../../lib/axios";

export default function useLogin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const login = async (input: LoginFormInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post("auth/login", input);
      await router.push("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.response.data.message);
    }
  };

  return { isLoading, error, login };
}
