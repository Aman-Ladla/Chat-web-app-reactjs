import React from "react";

const divStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    width: "100%",
};

const paraStyle = {
    color: "#c7cace",
};

const MessageStarter = () => {
    return (
        <div style={divStyle}>
            <p style={paraStyle}>Welcome to Chatting application.</p>
            <p style={paraStyle}>
                Please select a conversation to start chatting.
            </p>
        </div>
    );
};

export default MessageStarter;
