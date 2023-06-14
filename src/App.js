// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const FACING_MODE_USER = { exact: "user" };
  const FACING_MODE_ENVIRONMENT = { exact: "environment" };

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  const handleClick = React.useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  const [currentPos, setCurrentPos] = useState({x: 0,
    y: 0});
  const [startPos, setStartPos] = useState({
    x: 0,
    y: 0
  });
  const [distance, setDistance] = useState(0);

  const handleMouseDown = (event) => {
    // console.log(startPos);
    setCurrentPos({
      x: event.clientX,
      y: event.clientY,
    });
    setStartPos(currentPos);
    const dx = currentPos.x - startPos.x;
    const dy = currentPos.y - startPos.y;
    const result = Math.sqrt(dx * dx + dy * dy);

    setDistance(result);
  };

  // const handleMouseUp = (event) => {
  //   setEndPos({ x: event.clientX, y: event.clientY });
  //   console.log(endPos);
  // };
  // const calculateDistance = () => {
  //   const dx = endPos.x - startPos.x;
  //   const dy = endPos.y - startPos.y;
  //   return Math.sqrt(dx * dx + dy * dy);
  // };
  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={handleClick}
          style={{ margin: "auto", padding: "2rem", marginTop: "4rem" }}
        >
          Switch camera
        </button>
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            ...videoConstraints,
            facingMode,
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
            zindex: 8,
            width: 640,
            height: 480,
          }}
          onMouseDown={handleMouseDown}
          // onMouseUp={handleMouseUp}
        />
        {
          startPos.x !== 0 &&
          startPos.y !== 0 &&
          currentPos.x !== 0 &&
          currentPos.y !== 0 &&(<div style={{marginTop:"30rem"}}><p>Touch or click on the object to measure its size.</p>
          <p>Previous Position: {JSON.stringify(startPos)}</p>
          <p>Current Position: {JSON.stringify(currentPos)}</p>
          <p>Distance: {distance} pixels</p></div>)
        }
        
        {/* {startPos.x !== 0 &&
          startPos.y !== 0 &&
          endPos.x !== 0 &&
          endPos.y !== 0 && (
            
          )} */}
      </header>
    </div>
  );
}

export default App;
