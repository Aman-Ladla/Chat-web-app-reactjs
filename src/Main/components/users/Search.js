import React from "react";
import styles from "./Search.module.css";

const Search = (props) => {
    const inputHandler = (event) => {
        props.onInput(event.target.value);
    };

    return (
        <div className={styles.search}>
            <input
                type="text"
                placeholder="Search for conversation"
                onInput={inputHandler}
            />
        </div>
    );
};

export default Search;
