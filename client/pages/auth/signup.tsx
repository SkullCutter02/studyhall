import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextInputControl from "../../components/widgets/TextInputControl";
import SignupFormInput from "../../features/auth/types/signupFormInput.interface";
import { withAuthServerSideProps } from "../../hoc/withAuthServerSideProps";
import useSignup from "../../features/auth/hooks/useSignup";

const SignupPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape<Record<keyof SignupFormInput, yup.AnySchema>>({
        name: yup.string().max(25).required(),
        email: yup.string().email().required(),
        password: yup
          .string()
          .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
            message: "password needs to have a minimum of 8 characters, one letter and one number",
          })
          .required(),
      })
    ),
  });

  const { isLoading, isError, error, mutate } = useSignup();

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit((input) => mutate(input))}>
          <TextInputControl name={"name"} label={"Name"} register={register} error={errors.name} />
          <TextInputControl
            name={"email"}
            label={"Email"}
            register={register}
            inputProps={{ type: "email" }}
            error={errors.email}
          />
          <TextInputControl
            name={"password"}
            label={"Password"}
            register={register}
            inputProps={{ type: "password" }}
            error={errors.password}
          />
          <Button disabled={isLoading} type={"submit"}>
            Sign Up
          </Button>
          {isError && <Text textStyle={"error"}>{(error as any).response.data.message}</Text>}
        </form>
      </Box>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps(null, { redirectIfUserExists: true });

export default SignupPage;
