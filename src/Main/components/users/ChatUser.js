import React, { useContext } from "react";
import { ConversationContext } from "../../../shared/context/current-conversation-context";
import styles from "./ChatUser.module.css";

const ChatUser = (props) => {
    const conversationCtx = useContext(ConversationContext);

    const setConversationHandler = () => {
        props.onToggle();
        conversationCtx.setConversation(
            props.name,
            props.conversationId,
            props.party2Id,
            props.chatId
        );
    };

    return (
        <div
            className={`${styles["chat-user"]} ${
                conversationCtx.conversationId === props.conversationId &&
                styles["selected"]
            }`}
            onClick={setConversationHandler}
        >
            <p className={styles.name}>{props.name}</p>
            {/* <p className={styles.time}>{props.time}</p> */}
        </div>
    );
};

export default ChatUser;
