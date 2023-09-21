import React, { useEffect, useState } from "react";
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  TablePagination,
  TableFooter,
  Link as MaterialLink,
  Button,
} from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { NavLink as RouterNavLinkLink } from "react-router-dom";

import convertDate from "./utils/dates";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

const URL = "http://localhost:5000/article";
const ROW_PER_PAGE = 5;

const ArticleTable = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPagechange] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState({});

  const fetchArticleData = () => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => console.log("an unexpected error happend", error));
  };

  const deleteArticle = (id) => {
    fetch(`${URL}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const updatedArticles = articles.filter(
            (article) => article.id !== id
          );
          setArticles(updatedArticles);
        }
      })
      .catch((error) => console.log("an unexpected error happend", error));
  };

  const editArticle = (article) => {
    const { id, author, tag, title } = article;
    fetch(`${URL}/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author,
        tag,
        title,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const updatedArticles = articles.map((article) => {
          if (article.id !== id) {
            return article;
          } else {
            return data;
          }
        });
        setOpenEditModal(false);
        setArticles(updatedArticles);
      })
      .catch((error) => console.log("an unexpected error happend", error));
  };

  useEffect(() => {
    fetchArticleData();
  }, []);

  return (
    <Grid
      container
      direction="column"
      component="form"
      alignItems="center"
      minHeight="100vh"
      margin="auto"
      gap={5}
      width={5 / 6}
    >
      <MaterialLink
        alignSelf="end"
        sx={{ mt: 4 }}
        component={RouterNavLinkLink}
        to="/"
        onClick={() => localStorage.clear()}
      >
        Log Out
      </MaterialLink>
      <Typography variant="h3" align="center" alignSelf="start">
        Index
      </Typography>
      <MaterialLink
        alignSelf="end"
        component={RouterNavLinkLink}
        to="/new-article"
      >
        Add Article
      </MaterialLink>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Author</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles
              .slice(page * ROW_PER_PAGE, page * ROW_PER_PAGE + ROW_PER_PAGE)
              .map((article) => {
                const { title, author, created } = article;
                return (
                  <TableRow key={title}>
                    <TableCell component="th" align="center">
                      {title}
                    </TableCell>
                    <TableCell align="center">{author}</TableCell>
                    <TableCell align="center">{convertDate(created)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setSelectedArticle(article);
                          setOpenEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setSelectedArticle(article);
                          setOpenDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            {openDeleteModal && (
              <DeleteModal
                isOpen={openDeleteModal}
                article={selectedArticle}
                setIsOpen={setOpenDeleteModal}
                onDelete={deleteArticle}
              />
            )}
            {openEditModal && (
              <EditModal
                isOpen={openEditModal}
                setIsOpen={setOpenEditModal}
                onEdit={editArticle}
                article={selectedArticle}
              />
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[ROW_PER_PAGE]}
                sx={{ align: "center" }}
                rowsPerPage={ROW_PER_PAGE}
                page={page}
                count={articles.length}
                onPageChange={(event, newpage) => {
                  setPagechange(newpage);
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default ArticleTable;
