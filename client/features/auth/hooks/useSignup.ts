import { useMutation } from "react-query";

import SignupFormInput from "../types/signupFormInput.interface";
import { axios } from "../../../lib/axios";
import { useRouter } from "next/router";

export default function useSignup() {
  const router = useRouter();

  return useMutation(
    async (input: SignupFormInput) => {
      await axios.post("auth/signup", input);
    },
    {
      onSuccess: () => router.push("/"),
    }
  );
}
