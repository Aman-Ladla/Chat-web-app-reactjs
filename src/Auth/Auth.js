import { Fragment, useContext, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import Button from "../shared/FormElements/Button";
import Input from "../shared/FormElements/Input";
import { useForm } from "../shared/hooks/form-hook";
import useHttpClient from "../shared/hooks/http-hook";
import Card from "../shared/UIElements/Card";
import ErrorModal from "../shared/UIElements/ErrorModal";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../shared/util/validators";
import styles from "./Auth.module.css";

const Auth = () => {
    const initialValues = {
        inputs: {
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        isValid: false,
    };

    const [isLogin, setIsLogin] = useState(true);

    const [formState, inputHandler, setFormData] = useForm(initialValues);

    const authCtx = useContext(AuthContext);

    const { sendRequest, error, clearError } = useHttpClient();

    const setIsLoginHandler = () => {
        if (!isLogin) {
            // delete formState.inputs.name;
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLogin((prev) => !prev);
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        let url;
        let body;

        if (isLogin) {
            url = "http://localhost:8080/api/auth/login";
            body = JSON.stringify({
                email: formState.inputs.email.value,
                password: formState.inputs.password.value,
            });
        } else {
            url = "http://localhost:8080/api/auth/signup";
            body = JSON.stringify({
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
                password: formState.inputs.password.value,
            });
        }

        try {
            const resData = await sendRequest(url, "POST", body, {
                "Content-Type": "application/json",
            });
            authCtx.login(resData.userId, resData.name, resData.token);
        } catch (error) {
            // console.log(error);
        }
    };

    return (
        <Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            <div className={styles.Auth}>
                <Card>
                    <form
                        onSubmit={authSubmitHandler}
                        className={styles["form-control"]}
                    >
                        {!isLogin && (
                            <Input
                                id="name"
                                label="Name"
                                errorText="Please enter a valid name!"
                                onInput={inputHandler}
                                value={formState.name}
                                validators={[VALIDATOR_REQUIRE()]}
                            />
                        )}
                        <Input
                            id="email"
                            type="email"
                            label="Email"
                            errorText="Please enter a valid email!"
                            onInput={inputHandler}
                            value={formState.email}
                            validators={[VALIDATOR_EMAIL()]}
                        />
                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            errorText="Please enter a valid password(atleast 6 characters)!"
                            onInput={inputHandler}
                            value={formState.password}
                            validators={[VALIDATOR_MINLENGTH(6)]}
                        />
                        <Button type="submit" disabled={!formState.isValid}>
                            {isLogin ? "Login" : "Signup"}
                        </Button>
                        <p onClick={setIsLoginHandler}>
                            Switch to {isLogin ? "Signup" : "Login"}
                        </p>
                    </form>
                </Card>
            </div>
        </Fragment>
    );
};

export default Auth;
