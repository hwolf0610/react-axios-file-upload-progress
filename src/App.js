import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressBar from 'react-customizable-progressbar'
import Progress from 'react-progressbar';
import axios from 'axios';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      step: 100,
      uploadFile: null,
      fileFlag: false,
      previewImage: null,
    }
  }

  onUpload = () => {
    const config = {
      onUploadProgress: progressEvent => {
        console.log("total: ", progressEvent.total)
        console.log("uploading: ", progressEvent.loaded)
        console.log("percent: ", (progressEvent.loaded / progressEvent.total) * 100);
        let { progress } = this.state;
        progress = (progressEvent.loaded / progressEvent.total) * 100;
        this.setState({ progress });
        // console.log("progressEvent: ", progressEvent)
      }
    }

    let formData = new FormData();
    formData.append("file", this.state.uploadFile);
    axios.post('http://api.harrynaruto.com/api/v1/upload', formData, config).then(res => {
      if (res.data.status == 200) {
        console.log("done: ", res.data.message);
        toast("File upload done!");
      }
    }).catch(err => {
      console.log("error: ", err.message);
    })
  }

  onChangeFile = (event) => {
    console.log("file: ", event.target.files[0]);
    this.setState({ uploadFile: event.target.files[0] })
    this.setState({ previewImage: URL.createObjectURL(event.target.files[0]) })
    this.setState({ fileFlag: true })
  }

  render() {
    return (
      <div className="App">
        <h2>React File Uploader Progress Bar </h2>

        {this.state.progress > 0 && <div>
          <ProgressBar
            progress={this.state.progress}
            radius={100}
            steps={this.state.step}
            className="circle-progressbar-container-style"
          />
          <Progress completed={this.state.progress} className="line-progress-bar-margin-style" />
          <span>{this.state.progress}&nbsp; %</span></div>}
        <ToastContainer />

        <div className="file-upload-progress-control-container">
          {this.state.fileFlag == true &&
            <img src={this.state.previewImage} alt="preview image" style={{ width: "100%" }} />}
          <input type="file" onChange={this.onChangeFile} />
          <button onClick={this.onUpload.bind(this)} className="upload-button-style" >File Upload</button>
        </div>
      </div>
    )
  }
}
