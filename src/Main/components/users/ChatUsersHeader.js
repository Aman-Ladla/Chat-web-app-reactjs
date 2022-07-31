import React, { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import styles from "./ChatUsersHeader.module.css";

const ChatUsersHeader = () => {
    const authCtx = useContext(AuthContext);

    return (
        <div className={styles.header}>
            <p className={styles.name}>{authCtx.name}</p>
            <button className={styles.action} onClick={authCtx.logout}>
                Logout
            </button>
        </div>
    );
};

export default ChatUsersHeader;
