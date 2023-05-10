import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (params) => {
    const { data } = await axios.get("/articles", params);
    return data;
  }
);

export const fetchArticleComments = createAsyncThunk(
  "articles/fetchArticleComments",
  async (id) => {
    const { data } = await axios.get(`/comments/article/${id}`);

    return data;
  }
);

export const fetchAddArticleComment = createAsyncThunk(
  "articles/fetchAddArticleComment",
  async (params) => {
    const { data } = await axios.post(`/comments`, params);
    return data;
  }
);

export const fetchRemoveArticle = createAsyncThunk(
  "articles/fetchRemoveArticle",
  async (id) => axios.delete(`/articles/${id}`)
);

const initialState = {
  articles: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  comments: {
    items: [],
    status: "loading",
  },
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: {
    // getArticles
    [fetchArticles.pending]: (state) => {
      state.articles.items = [];
      state.articles.status = "loading";
    },
    [fetchArticles.fulfilled]: (state, action) => {
      console.log(action.meta.arg);

      if (action.meta.arg?.tagId) {
        state.articles.items = action.payload.filter(
          (obj) => obj.tag._id === action.meta.arg.tagId
        );
        if (action.meta.arg?.search) {
          state.articles.items = state.articles.items.filter((obj) =>
            obj.title.includes(action.meta.arg?.search)
          );
        }
      } else if (action.meta.arg?.search) {
        state.articles.items = action.payload.filter((obj) =>
          obj.title.includes(action.meta.arg?.search)
        );
      } else {
        state.articles.items = action.payload;
      }

      state.articles.status = "loaded";
    },
    [fetchArticles.rejected]: (state) => {
      state.articles.items = [];
      state.articles.status = "error";
    },
    // Remove article
    [fetchRemoveArticle.pending]: (state, action) => {
      state.articles.items = state.articles.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
    // Get comments of article
    [fetchArticleComments.pending]: (state) => {
      state.comments.items = state.comments.items;
      state.tags.status = "loading";
    },
    [fetchArticleComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [fetchArticleComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    },
    // Add comment to article
    [fetchAddArticleComment.pending]: (state, action) => {
      state.comments.items = state.comments.items;
      state.tags.status = "loading";
    },
  },
});

export const articlesReducer = articlesSlice.reducer;
