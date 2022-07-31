import React, { Fragment, useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import styles from "./Message.module.css";

const Message = (props) => {
    const authCtx = useContext(AuthContext);

    return (
        <Fragment>
            <div
                style={{ whiteSpace: "pre" }}
                className={`${styles.message} ${
                    props.message.sender.toString() ===
                    authCtx.userId.toString()
                        ? styles.me
                        : styles.other
                }`}
            >
                {!!props.message.message && props.message.message}
                {!!props.message.image && (
                    <img
                        style={{ maxHeight: "200px", maxWidth: "300px" }}
                        src={`http://localhost:8080/${props.message.image}`}
                        alt="Shared Img"
                    ></img>
                )}
                <div className={styles.timeStamp}>
                    {`${new Date(props.message.date).toLocaleTimeString('en',
                 { timeStyle: 'short', hour12: false, timeZone: 'UTC' })}`}
                </div>
            </div>
        </Fragment>
    );
};

export default Message;
