import { useEffect, useReducer } from "react";
import { validate } from "../util/validators";

const inputReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.value,
                isValid: validate(action.value, action.validators),
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};

const Input = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || "",
        isTouched: false,
        isValid: props.initialValue || false,
    });

    const { value, isValid } = inputState;
    const { id, onInput } = props;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [value, isValid, id, onInput]);

    const changeHandler = (event) => {
        dispatch({
            type: "CHANGE",
            value: event.target.value,
            validators: props.validators,
        });
    };

    const touchHandler = () => {
        dispatch({
            type: "TOUCH",
        });
    };

    return (
        <div>
            {props.label && <label htmlFor={props.id}>{props.label}</label>}
            <input
                type={props.type || "text"}
                id={props.id}
                placeholder={props.placeholder}
                value={props.value}
                onChange={changeHandler}
                onBlur={touchHandler}
            />
            {!inputState.isValid && inputState.isTouched && (
                <p>{props.errorText}</p>
            )}
        </div>
    );
};

export default Input;
