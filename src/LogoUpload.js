import React from 'react';
import FileUpload from "./components/FileUpload";

export default class LogoUpload extends React.Component {
    render() {
        return <div className={"container"}>
            <div className={"header"}>
                <h4 className={"header__title"}>Company Logo</h4>
                <p className={"header__subtitle"}>Logo should be square, 100px size and in png, jpeg file format.</p>
            </div>
            <div className={"body"}>
                <FileUpload />
            </div>
        </div>;
    }
}