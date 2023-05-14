import React from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Tab } from "@mui/material";
import { Tabs } from "@mui/material";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";
import styles from "./ArticleEditor.module.scss";
import { fetchTags } from "../../redux/slices/tags";

export const ArticleEditor = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const { tags } = useSelector((state) => state.tags);
  const [currentTag, setCurrentTag] = React.useState();
  const [imageUrl, setImageUrl] = React.useState("");
  const [tabsValue, setTabsValue] = React.useState(0);

  const isEditing = Boolean(id);
  const isTagsLoading = tags.status === "loading";

  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        imageUrl,
        tag: tags.items[tabsValue]._id,
        text,
      };

      console.log(fields);

      const { data } = isEditing
        ? await axios.patch(`/articles/${id}`, fields)
        : await axios.post("/articles", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/articles/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании статьи");
    }
  };

  React.useEffect(() => {
    dispatch(fetchTags());
    if (id) {
      axios
        .get(`/articles/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
        })
        .catch((error) => {
          console.warn(error);
          alert("Ошибка при получении статьи");
        });
    }
  }, []);

  React.useEffect(() => {}, [tabsValue]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (
    (!window.localStorage.getItem("token") && !isAuth) ||
    userData?.role === "user"
  ) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`${"http://localhost:4444"}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <Tabs
        onChange={(e, newValue) => setTabsValue(newValue)}
        value={tabsValue}
        aria-label="basic tabs example"
      >
        {(isTagsLoading ? [...Array(1)] : tags.items).map((obj, index) =>
          isTagsLoading ? (
            <Tab>Загрузка</Tab>
          ) : (
            <Tab key={obj._id} index={index + 1} label={obj.tagname}></Tab>
          )
        )}
      </Tabs>
      <SimpleMDE value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
