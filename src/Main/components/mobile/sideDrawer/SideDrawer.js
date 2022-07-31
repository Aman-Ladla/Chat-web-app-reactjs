import React from "react";
import Users from "../../users/Users";
import styles from "./SideDrawer.module.css";

const SideDrawer = (props) => {
    return (
        <div className={`${styles["mobile-nav"]} ${styles[props.className]}`}>
            <Users onToggle={props.onToggle} />
        </div>
    );
};

export default SideDrawer;
