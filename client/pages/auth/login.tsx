import React from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import TextInputControl from "../../components/widgets/TextInputControl";
import LoginFormInput from "../../features/auth/types/loginFormInput.interface";
import useLogin from "../../features/auth/hooks/useLogin";

const LoginPage: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormInput>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape<Record<keyof LoginFormInput, yup.AnySchema>>({
        email: yup.string().email().required(),
        password: yup.string().required(),
      })
    ),
  });

  const { isLoading, error, login } = useLogin();

  return (
    <>
      <Box>
        <Heading>Login</Heading>
        <form onSubmit={handleSubmit(login)}>
          <TextInputControl
            name={"email"}
            label={"Email"}
            inputProps={{ type: "email" }}
            register={register}
            error={errors.email}
          />
          <TextInputControl
            name={"password"}
            label={"Password"}
            inputProps={{ type: "password" }}
            register={register}
            error={errors.password}
          />
          <Button type={"submit"} disabled={isLoading}>
            Login
          </Button>
          {error && <Text textStyle={"error"}>{error}</Text>}
        </form>
      </Box>
    </>
  );
};

export default LoginPage;
