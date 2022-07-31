import React from "react";
import styles from "./NewConversationIcon.module.css";

const NewConversationIcon = (props) => {
    return (
        <div className={styles["new-conversation"]} onClick={props.onClick}>
            +
        </div>
    );
};

export default NewConversationIcon;
