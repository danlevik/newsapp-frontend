import React from "react";

// import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

export const CommentsSection = ({ items, children, isLoading = true }) => {
  return (
    <>
      <List>
        {(isLoading ? [...Array(1)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem>
              {isLoading ? (
                <div>loading</div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </>
  );
};
