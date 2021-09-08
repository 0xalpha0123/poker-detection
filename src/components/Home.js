import React, { useRef, createRef, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import _ from 'lodash';

import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

const url = {
    model: 'models/model.json'
};

// const loaded = false;

const useStyles = makeStyles({
    body: {
        padding: '15px',
        marginTop: '50px'
    },
    root: {
        maxWidth: "100%",
    },
    media: {
        height: 140,
    },
});

const Room = () => {

    const canvasRef = useRef(null);
    const videoRef = useRef(createRef());

    const classes = useStyles();
    const [model, setModel] = useState();
    const [stream, setStream] = useState();
    const [dimensions, setDimensions] = useState({
        videoWidth: 0,
        videoHeight: 0,
        offsetWidth: 0,
        offsetHeight: 0,
    });

    useEffect(() => {
        tf.ready().then(() => {
            loadModel(url);
        })
    }, []);

    const loadModel = (url) => {
        loadGraphModel(url.model)
        .then(m => {
            setModel(m);
            console.log('load model successfully');
        })
        .catch(err => {
            console.log('Error occupied while loading model:', err);
        })
    }

    const startDetect = () => {
        navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true
        })
        .then(str => {
            setStream(str);
            addVideoStream(videoRef.current, str);
        });
    };

    const stopDetect = () => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    };

    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.onloadeddata = () => {
            video.play().then(() => {
                resizeCanvas();
                detectFrame();
            })
        };
    };

    const resizeCanvas = () => {
        var ctx = canvasRef.current.getContext('2d');

        var dimensions = videoDimensions(videoRef.current);

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        canvasRef.current.style.width = dimensions.width;
        canvasRef.current.style.height = dimensions.height;
        canvasRef.current.style.left = (window.innerWidth - dimensions.width) / 2;
        canvasRef.current.style.top = (61 + window.innerHeight - dimensions.height) / 2;
    };

    const videoDimensions = (video) => {
        
        // Ratio of the video's intrisic dimensions
        var videoRatio = video.videoWidth / video.videoHeight;

        // The width and height of the video element
        var width = video.offsetWidth, height = video.offsetHeight;

        // The ratio of the element's width to its height
        var elementRatio = width/height;

        // If the video element is short and wide
        if(elementRatio > videoRatio) {
            width = height * videoRatio;
        } else {
            // It must be tall and thin, or exactly equal to the original ratio
            height = width / videoRatio;
        }

        return {
            width: width,
            height: height
        };
    };


    var prevTime;
    var pastFrameTimes = [];

    const detectFrame = () => {
        if (!model) return requestAnimationFrame(detectFrame);
        tf.engine().startScope();
        model.executeAsync(preprocess_input(stream)).then(predictions => {
            
            requestAnimationFrame(detectFrame);
            console.log(predictions);

            if(prevTime) {
                pastFrameTimes.push(Date.now() - prevTime);
                if(pastFrameTimes.length > 30) pastFrameTimes.shift();

                var total = 0;
                _.each(pastFrameTimes, function(t) {
                    total += t/1000;
                });

                var fps = pastFrameTimes.length / total;
                console.log(Math.round(fps), 'fps');
            }
            prevTime = Date.now();
        });
    };

    const preprocess_input = () => {
        const tfimg = tf.browser.fromPixels(videoRef.current).toInt();
        const resized_image = tf.image.resizeBilinear(tfimg, [608, 608]).toFloat();
        const expandedimg = resized_image.transpose([0, 1, 2]).expandDims(0);
        return expandedimg;
    };

    return (
        <div className={classes.body}>
            <video id='video' autoPlay muted playsInline ref={videoRef}></video>
            <Button variant="contained" color="primary" onClick={startDetect}>Start</Button>
            <Button variant="contained" color="primary" onClick={stopDetect}>Stop</Button>
            <canvas
                className="size"
                ref={canvasRef}
                width="600"
                height="500"
            />
        </div>
    );
}

export default Room;
