import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  height?: number;
  isRequired?: boolean;
  register?: UseFormRegister<any>;
  error?: {
    message: string;
  };
  textareaProps?: TextareaProps;
  labelProps?: FormLabelProps;
  errorMessageProps?: FormErrorMessageProps;
}

const TextAreaControl: React.FC<Props> = ({
  name,
  label,
  height = "4xs",
  isRequired = true,
  register,
  error,
  textareaProps,
  labelProps,
  errorMessageProps,
}) => {
  return (
    <>
      <FormControl isRequired={isRequired} isInvalid={!!error?.message}>
        <FormLabel htmlFor={name} {...labelProps}>
          {label}
        </FormLabel>
        <Textarea
          id={name}
          name={name}
          height={height}
          resize={"none"}
          {...textareaProps}
          {...(register && register(name))}
        />
        <FormErrorMessage {...errorMessageProps}>{error?.message}</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default TextAreaControl;
