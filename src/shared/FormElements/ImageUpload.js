import { Fragment, useEffect, useRef, useState } from "react";

const ImageUpload = (props) => {
    const filePickerRef = useRef();

    const [file, setFile] = useState();
    const [isValid, setIsValid] = useState(false);

    const { onPick } = props;

    useEffect(() => {
        if (!file) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => {
            onPick(fileReader.result, file, isValid);
        };
        fileReader.readAsDataURL(file);
    }, [file, onPick, isValid]);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    const clearingImage = () => {
        filePickerRef.current.value = null;
    };

    const pickHandler = (event) => {
        let pickedFile;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    return (
        <Fragment>
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".jpg, .png, .jpeg"
                onClick={clearingImage}
                onInput={pickHandler}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-card-image"
                viewBox="0 0 16 16"
                onClick={pickImageHandler}
            >
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
            </svg>
        </Fragment>
    );
};

export default ImageUpload;
