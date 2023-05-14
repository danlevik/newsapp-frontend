import React from "react";

import { Article } from "../components/Article/Article";
import { AddComment } from "../components/AddComment/AddComment";
import { CommentsBlock } from "../components/CommentsSection";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { fetchArticleComments } from "../redux/slices/articles";
import { selectIsAuth } from "../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";

export const ArticlePage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const commentData = useSelector((state) => state.articles.comments);

  const [articleData, setArticleData] = React.useState();
  // const [articleCommentData, setArticleCommentData] = React.useState();

  const [isLoadingArticle, setLoadingArticle] = React.useState(true);
  const [isLoadingComments, setLoadingComments] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/articles/${id}`)
      .then((res) => {
        setArticleData(res.data);
        setLoadingArticle(false);
        return res.data._id;
      })
      .then((res) => {
        dispatch(fetchArticleComments(res));
        setLoadingComments(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка получения статьи и комментариев");
      });
  }, []);

  if (isLoadingArticle || isLoadingComments) {
    return (
      <Article
        isLoading={isLoadingArticle || isLoadingComments}
        isFullPost
      ></Article>
    );
  }

  return (
    <>
      <Article
        id={articleData._id}
        title={articleData.title}
        imageUrl={
          articleData.imageUrl
            ? `${"http://localhost:4444"}${articleData.imageUrl}`
            : ""
        }
        user={articleData.user}
        createdAt={articleData.createdAt}
        viewsCount={articleData.viewsCount}
        commentsCount={commentData.items.length}
        isFullPost
      >
        <ReactMarkdown children={articleData.text} />
      </Article>
      <CommentsBlock items={commentData.items} isLoading={false}>
        {isAuth ? <AddComment articleId={id} /> : <></>}
      </CommentsBlock>
    </>
  );
};
