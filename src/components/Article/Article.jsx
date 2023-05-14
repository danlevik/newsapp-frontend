import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import styles from "./Article.module.scss";
import { UserInfo } from "../UserInfo/UserInfo";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchRemoveArticle } from "../../redux/slices/articles";

export const Article = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  tag,
  viewsCount,
  commentsCount,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  if (isLoading) {
    return <div>loading</div>;
  }

  const onClickRemove = () => {
    if (window.confirm("Вы действительно хотите удалить статью?")) {
      dispatch(fetchRemoveArticle(id));
    }
  };

  return (
    <div className={styles.root}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/articles/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && <img className={styles.image} src={imageUrl} alt={title} />}
      <div className={styles.wrapper}>
        <UserInfo
          {...user}
          additionalText={new Date(createdAt).toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
        <div className={styles.indention}>
          <h2 className={styles.title}>
            {isFullPost ? title : <Link to={`/articles/${id}`}>{title}</Link>}
          </h2>
          {children && <div className={styles.content}>{children}</div>}
          <div className={styles.tag}>{tag}</div>
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
