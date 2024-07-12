import { useRef } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from 'react-webcam';
import './App.css';
import { drawMesh } from './utilities';


function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //load facemesh
  async function runFacemesh() {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });

    setInterval(() => {
      detect(net);
    }, 100);
  }


  //detect function
  async function detect(net) {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  }


  runFacemesh();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
      </header>
    </div>
  );
}

export default App;
