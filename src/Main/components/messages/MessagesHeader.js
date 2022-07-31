import React, { useContext } from "react";
import { ConversationContext } from "../../../shared/context/current-conversation-context";
import ToggleButton from "../mobile/components/ToggleButton";
import styles from "./MessagesHeader.module.css";

const MessagesHeader = (props) => {
    const conversationCtx = useContext(ConversationContext);
    const conversationId = conversationCtx.conversationId;
    const conversationName = conversationCtx.name;

    const mobileNavOpenHandler = () => {
        props.onToggle();
    };

    return (
        <div className={styles.header}>
            <ToggleButton onOpen={mobileNavOpenHandler} />
            {conversationId && (
                <p className={styles.name}>{conversationName}</p>
            )}
        </div>
    );
};

export default MessagesHeader;
