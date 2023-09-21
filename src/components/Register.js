import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Grid,
  Button,
  Typography,
  Link as MaterialLink,
  Snackbar,
  Alert,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { NavLink as RouterNavLinkLink } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const URL = "http://localhost:5000/users";

const schema = z
  .object({
    email: z.string().nonempty("Email is required").email("Email is invalid"),
    password: z.string().nonempty("Password is required"),
    confirmationPassword: z
      .string()
      .nonempty("confirmationPassword is required"),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords don't match",
    path: ["confirmationPassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const onSubmit = (data) => {
    const { email, password } = data;

    fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data === "string") {
          // In order to show error toast
          setErrorMessage(data);
        } else {
          // In order to show success toast
          setSuccessMessage(`you successfully registered, please login`);
        }
      })
      .catch((error) => console.log("an unexpected error happend", error));
  };

  return (
    <Grid
      container
      direction="column"
      component="form"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      margin="auto"
      gap={5}
      width={1 / 2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h3" align="center" alignSelf="start">
        Register
      </Typography>
      <TextField
        required
        id="email"
        label="Email Address:"
        autoFocus
        fullWidth
        error={!!errors["email"]}
        helperText={errors["email"] ? errors["email"].message : ""}
        {...register("email")}
      />
      <TextField
        required
        id="password"
        type="password"
        label="Password:"
        fullWidth
        error={!!errors["password"]}
        helperText={errors["password"] ? errors["password"].message : ""}
        {...register("password")}
      />
      <TextField
        required
        id="confirmationPassword"
        type="password"
        label="Confirmation:"
        fullWidth
        error={!!errors["confirmationPassword"]}
        helperText={
          errors["confirmationPassword"]
            ? errors["confirmationPassword"].message
            : ""
        }
        {...register("confirmationPassword")}
      />
      <Button type="submit" variant="contained" fullWidth>
        Sign Up
      </Button>
      {(errorMessage || successMessage) && (
        <Snackbar open={Boolean(errorMessage || successMessage)}>
          {
            <Alert
              severity={successMessage ? "success" : "error"}
              sx={{ width: "100%" }}
              onClose={() => {
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              {successMessage || errorMessage}
            </Alert>
          }
        </Snackbar>
      )}
      <Typography paragraph>
        Already have an account
        <MaterialLink
          sx={{ ml: 1, cursor: "pointer" }}
          component={RouterNavLinkLink}
          to="/login"
        >
          Login
        </MaterialLink>
      </Typography>
    </Grid>
  );
};

export default Register;
