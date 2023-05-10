import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  fetchAddArticleComment,
  fetchArticleComments,
} from "../../redux/slices/articles";

export const AddComment = ({ articleId }) => {
  const dispatch = useDispatch();
  const [text, setText] = React.useState("");

  const onSubmit = async () => {
    try {
      const fields = {
        text,
        articleId,
      };

      await dispatch(fetchAddArticleComment(fields));
      const data = await dispatch(fetchArticleComments(articleId));
      setText("");
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании комментария");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            minRows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
