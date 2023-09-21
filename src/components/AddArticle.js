import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Grid,
  Button,
  Typography,
  Link as MaterialLink,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";

import { NavLink as RouterNavLinkLink, useNavigate } from "react-router-dom";

const URL = "http://localhost:5000/article";
const TAG_URL = "http://localhost:5000/tags";
const REDIRECT_TABLE_TIME = 6000;

const AddArticle = () => {
  const { register, handleSubmit, control } = useForm();
  const [tags, setTags] = useState([]);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();

  const fetchTags = () => {
    fetch(TAG_URL)
      .then((response) => response.json())
      .then((data) => setTags([...new Set(data)]));
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const onSubmit = (data) => {
    const { title, content, tag, author } = data;
    // TODO: check if title is not repetative using context hooks
    fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
        content,
        tag,
        author,
        created: new Date().toJSON(),
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          // In order to show success toast
          setSuccessMessage(`Article ${title} successfully added`);
          setTimeout(() => {
            navigate("/index");
          }, REDIRECT_TABLE_TIME);
        } else {
          // In order to show error toast
          setErrorMessage("An Error Occured, please try again.");
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
      spacing={24}
      onSubmit={handleSubmit(onSubmit)}
    >
      <MaterialLink
        alignSelf="end"
        component={RouterNavLinkLink}
        to="/"
        onClick={() => localStorage.clear()}
      >
        Log Out
      </MaterialLink>
      <Typography variant="h3" align="center" alignSelf="start" xs={4}>
        New Article
      </Typography>
      <MaterialLink alignSelf="end" component={RouterNavLinkLink} to="/index">
        Back to Index
      </MaterialLink>
      <TextField
        required
        id="title"
        label="Title:"
        autoFocus
        fullWidth
        {...register("title")}
      />
      <TextField
        required
        id="author"
        label="Author:"
        autoFocus
        fullWidth
        {...register("author")}
      />
      <TextField
        id="content"
        label="Content:"
        fullWidth
        multiline
        variant="outlined"
        minRows={3}
        maxRows={5}
        {...register("content")}
      />
      <FormControl fullWidth required>
        <InputLabel id="tags-id">Tags</InputLabel>
        <Controller
          control={control}
          name="tag"
          defaultValue=""
          render={({ field }) => (
            <Select labelId="tags-id" {...field}>
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      <Button type="submit" variant="contained" fullWidth>
        Create
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
    </Grid>
  );
};

export default AddArticle;
