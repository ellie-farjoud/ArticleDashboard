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
import { NavLink as RouterNavLinkLink, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const URL = "http://localhost:5000/login";

const schema = z.object({
  email: z.string().nonempty("Email is required").email("Email is invalid"),
  password: z.string().nonempty("Password is required"),
});

const Login = () => {
  const [errorMessage, setErrorMessage] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, password } = data;
    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("token", JSON.stringify(data.accessToken));
          navigate("/index");
        } else {
          setErrorMessage(data);
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
        Login
      </Typography>
      <TextField
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
      <Button type="submit" variant="contained" fullWidth>
        Sign In
      </Button>
      {errorMessage && (
        <Snackbar open={Boolean(errorMessage)}>
          {
            <Alert
              severity={"error"}
              sx={{ width: "100%" }}
              onClose={() => {
                setErrorMessage("");
              }}
            >
              {errorMessage}
            </Alert>
          }
        </Snackbar>
      )}
      <Typography paragraph>
        Don't have an account?
        <MaterialLink
          sx={{ ml: 1, cursor: "pointer" }}
          component={RouterNavLinkLink}
          to="/register"
        >
          Register
        </MaterialLink>
      </Typography>
    </Grid>
  );
};

export default Login;
