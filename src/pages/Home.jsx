import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";

import { Post } from "../components/Post";

import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../redux/slices/articles";
import { fetchTags } from "../redux/slices/tags";
import { fetchComments } from "../redux/slices/comments";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { articles } = useSelector((state) => state.articles);
  const { tags } = useSelector((state) => state.tags);
  const { comments } = useSelector((state) => state.comments);
  const [tabsValue, setTabsValue] = useState(0);
  const [searchText, setSearchText] = useState("");
  // const [filteredArticles, setFilteredArticles] = useState("");

  const isArticlesLoading = articles.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const isCommentsLoading = comments.status === "loading";

  React.useEffect(() => {
    dispatch(fetchArticles());
    dispatch(fetchComments());
    dispatch(fetchTags());
  }, []);

  React.useEffect(() => {
    console.log(tabsValue);
    dispatch(
      fetchArticles({
        tagId: tabsValue == 0 ? undefined : tags.items[tabsValue - 1]._id,
        search: searchText == "" ? undefined : searchText,
      })
    );
  }, [tabsValue, searchText]);

  return (
    <>
      <TextField
        style={{ marginBottom: 15 }}
        id="search"
        label="Поиск"
        variant="filled"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Tabs
        onChange={(e, newValue) => setTabsValue(newValue)}
        style={{ marginBottom: 15 }}
        value={tabsValue}
        aria-label="basic tabs example"
      >
        <Tab label="Все статьи" />
        {(isTagsLoading ? [...Array(1)] : tags.items).map((obj, index) =>
          isTagsLoading ? (
            <Tab>Загрузка</Tab>
          ) : (
            <Tab key={obj._id} index={index + 1} label={obj.tagname}></Tab>
          )
        )}
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {(isArticlesLoading ? [...Array(1)] : articles.items).map(
            (obj, index) =>
              isArticlesLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  id={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""
                  }
                  user={obj.user}
                  tag={obj.tag.tagname}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={
                    isCommentsLoading
                      ? 999
                      : comments.items.filter(
                          (comment) => comment.article === obj._id
                        ).length
                  }
                  isEditable={userData?._id === obj.user._id}
                />
              )
          )}
        </Grid>
      </Grid>
    </>
  );
};
