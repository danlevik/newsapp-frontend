import React from "react";
import styles from "./UserInfo.module.scss";
import clsx from "clsx";

export const UserInfo = ({ fullName, additionalText, isFullArticle }) => {
  return (
    <div className={styles.root}>
      <div className={styles.userDetails}>
        <span
          className={clsx(styles.userName, {
            [styles.userNameCard]: !isFullArticle,
          })}
        >
          {fullName}
        </span>
        <span
          className={clsx(styles.additional, {
            [styles.additionalCard]: !isFullArticle,
          })}
        >
          {additionalText}
        </span>
      </div>
    </div>
  );
};
