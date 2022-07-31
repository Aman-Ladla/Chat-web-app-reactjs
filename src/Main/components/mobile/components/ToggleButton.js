import React from "react";
import "./ToggleButton.css";

const ToggleButton = (props) => {
    return (
        <button className={`mobile-toggle`} onClick={props.onOpen}>
            <span className="mobile-toggle__bar" />
            <span className="mobile-toggle__bar" />
            <span className="mobile-toggle__bar" />
        </button>
    );
};

export default ToggleButton;
