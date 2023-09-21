import React, { useEffect, useState } from "react";

import {
  Grid,
  DialogTitle,
  DialogContent,
  Dialog,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const TAG_URL = "http://localhost:5000/tags";

const EditModal = (props) => {
  const { register, handleSubmit, control } = useForm();
  const { isOpen, setIsOpen, onEdit, article } = props;
  const [tags, setTags] = useState([]);

  const fetchTags = () => {
    fetch(TAG_URL)
      .then((response) => response.json())
      .then((data) => setTags([...new Set(data)]));
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const onSubmit = (data) => {
    if (data) {
      onEdit({ id: article.id, ...data });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="edit-dialog"
    >
      <DialogTitle id="edit-dialog">Edit Article</DialogTitle>
      <DialogContent component="form">
        <Grid
          container
          component="form"
          alignItems="center"
          justifyContent="center"
          margin="auto"
          sx={{ pt: 1 }}
          gap={2}
          width={1 / 2}
          spacing={24}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            required
            id="title"
            label="Title:"
            autoFocus
            fullWidth
            defaultValue={article.title}
            {...register("title")}
          />
          <TextField
            required
            id="author"
            label="Author:"
            autoFocus
            fullWidth
            defaultValue={article.author}
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
            defaultValue={article.content}
            {...register("content")}
          />
          <FormControl fullWidth required>
            <InputLabel id="tags-id">Tags</InputLabel>
            {tags.length > 0 && (
              <Controller
                required
                control={control}
                name="tag"
                defaultValue={article.tag}
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
            )}
          </FormControl>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              onSubmit();
            }}
          >
            Edit
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
