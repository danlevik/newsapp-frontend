import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { Route, Routes } from "react-router-dom";

import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/articles/:id" element={<FullPost />}></Route>
          <Route path="/articles/:id/edit" element={<AddPost />}></Route>
          <Route path="/add-article" element={<AddPost />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Registration />}></Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
