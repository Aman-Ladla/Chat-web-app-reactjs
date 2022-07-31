import React, { Fragment, useCallback, useContext, useState } from "react";
import { ConversationContext } from "../../../shared/context/current-conversation-context";
import Messages from "./Messages";
import MessagesFooter from "./MessagesFooter";
import MessagesHeader from "./MessagesHeader";
import MessageStarter from "./MessageStarter";

const Chat = (props) => {
    const conversationCtx = useContext(ConversationContext);

    let element;

    const [sendButtonValue, setSendButtonValue] = useState("unclicked");

    const messageSendHandler = useCallback((value) => {
        setSendButtonValue(value);
    }, []);

    if (!conversationCtx.conversationId) {
        element = <MessageStarter />;
    } else {
        element = (
            <Fragment>
                {/* <LoadingSpinner asOverlay /> */}
                <Messages
                    onMessageSend={messageSendHandler}
                    sendButtonValue={sendButtonValue}
                />
                {sendButtonValue === "unclicked" && (
                    <MessagesFooter onMessageSend={messageSendHandler} />
                )}
            </Fragment>
        );
    }

    return (
        <Fragment>
            <MessagesHeader
                mobileNavOpen={props.mobileNavOpen}
                onToggle={props.onToggle}
            />
            {element}
        </Fragment>
    );
};

export default Chat;
