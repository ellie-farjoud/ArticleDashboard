import React from "react";

import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";

const DeleteModal = (props) => {
  const { isOpen, setIsOpen, onDelete, article } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="delete-dialog"
    >
      <DialogTitle id="delete-dialog">Delete Article</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this article?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>No</Button>
        <Button
          onClick={() => {
            setIsOpen(false);
            onDelete(article.id);
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
