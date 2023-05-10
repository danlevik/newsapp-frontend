import { configureStore } from "@reduxjs/toolkit";
import { articlesReducer } from "./slices/articles";
import { authReducer } from "./slices/auth";
import { tagsReducer } from "./slices/tags";
import { commentsReducer } from "./slices/comments";

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    auth: authReducer,
    tags: tagsReducer,
    comments: commentsReducer,
  },
});

export default store;
