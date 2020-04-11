// @flow
import * as React from 'react';
import ProgressRing from "./ProgressRing";

type ReactObjRef<ElementType: React.ElementType> =
    { current: any | React.ElementRef<ElementType> }

type FileUploadProps = {|
    value: null | string | ArrayBuffer,
    onChange: void
|}

type FileUploadState = {|
    urlImage: null | string | ArrayBuffer,
    hoverDrop: boolean,
    uploadImage: boolean,
    error: boolean,
    progress: number
|}

class FileUpload extends React.Component<FileUploadProps, FileUploadState> {
    dropRef: ReactObjRef<'div'>
    dragCounter: number

    constructor(props: FileUploadProps) {
        super(props);
        this.state = {
            urlImage: '',
            hoverDrop: false,
            uploadImage: false,
            error: false,
            progress: 0
        }

        this.dropRef = React.createRef()
        this.dragCounter = 0;
    }

    handleDrag = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e: Object) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length === 1) {
            this.setState({hoverDrop: true})
        }
    }
    handleDragOut = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({hoverDrop: false})
        }
    }

    handleDrop = (e: Object) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({hoverDrop: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
            this.handleChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }
    componentDidMount() {
        this.setState({urlImage: this.props.value})
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }
    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    cancelLoad = () => {
        this.setState({
            urlImage: '',
            uploadImage: false
        });
    }

    handleChange = (file: Object) => {
        let reader = new FileReader(), self = this;
        if (file !== undefined) {

            self.setState({uploadImage: true})

            const interval = setInterval(() => {
                this.setState({ progress: self.state.progress + 10 })
                if (self.state.progress === 100) {
                    clearInterval(interval)
                }
            }, 100)

            reader.readAsDataURL(file);
            reader.onload = function (e: Object) {

                let image = new Image();
                image.src = e.target.result;

                image.onload = function () {
                    let height = this.height;
                    let width = this.width;
                    if (height > 100 || width > 100) {
                        self.setState({
                            urlImage: '',
                            uploadImage: false,
                            error: true
                        });
                        setTimeout(function () {
                            clearInterval(interval)
                            self.setState({
                                error: false,
                                progress: 0
                            });
                        }, 2000)
                    } else {
                        setTimeout(function () {
                            clearInterval(interval)
                            self.state.uploadImage ? self.setState({
                                urlImage: reader.result,
                                uploadImage: false,
                                progress: 0
                            }) :   self.setState({
                                urlImage: '',
                                progress: 0
                            });
                        }, 1500);
                    }
                }
            }
        }
    }

    render() {
        const { urlImage, hoverDrop, uploadImage, error, progress } = this.state;

        return <div className={`block__drop ${hoverDrop ? "block__drop_hover" : ""} ${error ? "block__drop_error" : ""}`}
                ref={this.dropRef}>
            <div className={"box__img"}>
                {
                    uploadImage ? <ProgressRing
                        radius={ 42 }
                        stroke={ 1 }
                        progress={ progress }
                    /> :''
                }
                {
                    urlImage ? <img src={urlImage} alt="logo"/>
                        : <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M28.072 1.87489C29.3858 1.3494 30.8148 2.31692 30.8148 3.73184V46.7037H1.18518V13.9837C1.18518 13.1659 1.68308 12.4305 2.4424 12.1267L28.072 1.87489Z" stroke="#D1E3F8"/>
                            <rect x="7.11108" y="17.0745" width="7.40741" height="8.88889" fill="#D1E3F8"/>
                            <rect x="17.4814" y="17.0745" width="7.40741" height="2.96296" fill="#D1E3F8"/>
                            <rect x="17.4814" y="11.1486" width="7.40741" height="2.96296" fill="#D1E3F8"/>
                            <path d="M7.11108 29.9264C7.11108 29.3741 7.5588 28.9264 8.11108 28.9264H23.8889C24.4411 28.9264 24.8889 29.3741 24.8889 29.9264V46.7041H7.11108V29.9264Z" fill="#D1E3F8"/>
                            <rect x="17.4814" y="23.0004" width="7.40741" height="2.96296" fill="#D1E3F8"/>
                        </svg>
                }
            </div>
            <div className={"box__process"}>
                <p>
                    {
                    uploadImage ? `Uploading` :
                        urlImage ? `Drag & drop here to replace` : `Drag & drop here`
                    }
                </p>
                <span>- or -</span>
                {
                    uploadImage ? <label onClick={() => this.cancelLoad()}>Cancel</label> :
                        <label htmlFor="fileUpload">
                            {
                                urlImage ? `Select file to replace` : `Select file to upload`
                            }
                        </label>
                }
                <input
                    type={"file"}
                    id={"fileUpload"}
                    name={"file"}
                    multiple={false}
                    accept={"image/jpeg, image/png"}
                    onChange={typeof this.props.onChange === "function" ? this.props.onChange() :
                        (e) => this.handleChange(e.target.files[0])
                    }
                />
            </div>
        </div>;
    }
}
export default FileUpload;