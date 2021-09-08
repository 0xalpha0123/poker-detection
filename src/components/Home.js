import React, { useRef, createRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

tf.setBackend('webgl');

const threshold = 0.75;

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

const windows = [
    'window1',
    // 'window2',
    // 'window3',
    // 'window4',
]

const classesDir = {
    1: {
        name: '10C',
        color: '#FE0056',
        id: 1,
    },
    2: {
        name: '10D',
        color: '#0E7AFE',
        id: 2,
    },
    3: {
        name: '10H',
        color: '#00FFCE',
        id: 3,
    },
    4: {
        name: '10S',
        color: '#00B7EB',
        id: 4,
    },
    5: {
        name: '2C',
        color: '#0000FF',
        id: 5,
    },
    6: {
        name: '2D',
        color: '#FFABAB',
        id: 6,
    },
    7: {
        name: '2H',
        color: '#FF00FF',
        id: 7,
    },
    8: {
        name: '2S',
        color: '#00B7EB',
        id: 8,
    },
    9: {
        name: '3C',
        color: '#8622FF',
        id: 9,
    },
    10: {
        name: '3D',
        color: '#FFFF00',
        id: 10,
    },
    11: {
        name: '3H',
        color: '#00FFCE',
        id: 11,
    },
    12: {
        name: '3S',
        color: '#CCCCCC',
        id: 12,
    },
    13: {
        name: '4C',
        color: '#FE0056',
        id: 13,
    },
    14: {
        name: '4D',
        color: '#0E7AFE',
        id: 14,
    },
    15: {
        name: '4H',
        color: '#FF00FF',
        id: 15,
    },
    16: {
        name: '4S',
        color: '#CCCCCC',
        id: 16,
    },
    17: {
        name: '5C',
        color: '#00B7EB',
        id: 17,
    },
    18: {
        name: '5D',
        color: '#0E7AFE',
        id: 18,
    },
    19: {
        name: '5H',
        color: '#FFFF00',
        id: 19,
    },
    20: {
        name: '5S',
        color: '#C7FC00',
        id: 20,
    },
    21: {
        name: '6C',
        color: '#FFABAB',
        id: 21,
    },
    22: {
        name: '6D',
        color: '#FF8000',
        id: 22,
    },
    23: {
        name: '6H',
        color: '#0E7AFE',
        id: 23,
    },
    24: {
        name: '6S',
        color: '#C7FC00',
        id: 24,
    },
    25: {
        name: '7C',
        color: '#00FFCE',
        id: 25,
    },
    26: {
        name: '7D',
        color: '#0000FF',
        id: 26,
    },
    27: {
        name: '7H',
        color: '#FE0056',
        id: 27,
    },
    28: {
        name: '7S',
        color: '#C7FC00',
        id: 28,
    },
    29: {
        name: '8C',
        color: '#FFABAB',
        id: 29,
    },
    30: {
        name: '8D',
        color: '#FF00FF',
        id: 30,
    },
    31: {
        name: '8H',
        color: '#8622FF',
        id: 31,
    },
    32: {
        name: '8S',
        color: '#FFABAB',
        id: 32,
    },
    33: {
        name: '9C',
        color: '#C7FC00',
        id: 33,
    },
    34: {
        name: '9D',
        color: '#0E7AFE',
        id: 34,
    },
    35: {
        name: '9H',
        color: '#CCCCCC',
        id: 35,
    },
    36: {
        name: '9S',
        color: '#FFFF00',
        id: 36,
    },
    37: {
        name: 'AC',
        color: '#8622FF',
        id: 37,
    },
    38: {
        name: 'AD',
        color: '#FF8000',
        id: 38,
    },
    39: {
        name: 'AH',
        color: '#000000',
        id: 39,
    },
    40: {
        name: 'AS',
        color: '#FE0056',
        id: 40,
    },
    41: {
        name: 'JC',
        color: '#CCCCCC',
        id: 41,
    },
    42: {
        name: 'JD',
        color: '#0000FF',
        id: 42,
    },
    43: {
        name: 'JH',
        color: '#FE0056',
        id: 43,
    },
    44: {
        name: 'JS',
        color: '#8622FF',
        id: 44,
    },
    45: {
        name: 'KC',
        color: '#FF8000',
        id: 45,
    },
    46: {
        name: 'KD',
        color: '#FF00FF',
        id: 46,
    },
    47: {
        name: 'KH',
        color: '#8622FF',
        id: 47,
    },
    48: {
        name: 'KS',
        color: '#C7FC00',
        id: 48,
    },
    49: {
        name: 'QC',
        color: '#0000FF',
        id: 49,
    },
    50: {
        name: 'QD',
        color: '#FF00FF',
        id: 50,
    },
    51: {
        name: 'QH',
        color: '#000000',
        id: 51,
    },
    52: {
        name: 'QS',
        color: '#000000',
        id: 52,
    },
}

const Room = () => {

    const streams = [];

    const classes = useStyles();
    const videoRefs = useRef([]);
    const canvasRef = useRef(null);
    const [model, setModel] = useState();

    videoRefs.current = windows.map((title, i) => videoRefs.current[i] ?? createRef());

    useEffect(() => {
        tf.ready().then(() => {
            loadModel(url);
        });
    }, []);

    async function loadModel(url) {
        try {
            console.log(url.model)
            const model = await loadGraphModel(url.model);
            setModel(model);
            console.log("load model success");
        }
        catch (err) {
            console.log(err);
        }
    };

    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            detectFrame(video, model);
        });
    };

    const removeWindow = (index) => {
        streams[index].getTracks().forEach((track) => {
            track.stop();
        });
    };
    
    const selectWindow = (index) => {
        navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true,
        })
        .then(stream => {
            streams[index] = stream;
            addVideoStream(videoRefs.current[index].current, stream);
        });
    };

    const detectFrame = (video, model) => {
        tf.engine().startScope();
        model.executeAsync(process_input(video)).then(predictions => {
            renderPredictions(predictions, video);
            requestAnimationFrame(() => {
                detectFrame(video, model);
            });
            tf.engine().endScope();
        });
    };

    const process_input = (video_frame) => {
        const tfimg = tf.browser.fromPixels(video_frame).toInt();
        const resized_image = tf.image.resizeBilinear(tfimg, [608,608]).toFloat();
        const expandedimg = resized_image.transpose([0, 1, 2]).expandDims(0);
        return expandedimg;
    };

    const buildDetectedObjects = (scores, threshold, boxes, classes, classesDir) => {
        const detectionObjects = []
        var video_frame = document.getElementById('window0');
    
        scores[0].forEach((score, i) => {
            if (score > threshold) {
            const bbox = [];
            const minY = boxes[0][i][0] * video_frame.offsetHeight;
            const minX = boxes[0][i][1] * video_frame.offsetWidth;
            const maxY = boxes[0][i][2] * video_frame.offsetHeight;
            const maxX = boxes[0][i][3] * video_frame.offsetWidth;
            bbox[0] = minX;
            bbox[1] = minY;
            bbox[2] = maxX - minX;
            bbox[3] = maxY - minY;
            detectionObjects.push({
                class: classes[i],
                label: classesDir[classes[i]].name,
                score: score.toFixed(4),
                bbox: bbox
            })
            }
        })
        return detectionObjects
    }

    const renderPredictions = predictions => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        
        console.log(predictions)
        //Getting predictions
        const boxes = predictions[4].arraySync();
        const scores = predictions[5].arraySync();
        const classes = predictions[6].dataSync();
        const detections = buildDetectedObjects(scores, threshold,
                                        boxes, classes, classesDir);
    
        detections.forEach(item => {
            const x = item['bbox'][0];
            const y = item['bbox'][1];
            const width = item['bbox'][2];
            const height = item['bbox'][3];
    
            // Draw the bounding box.
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
    
            // Draw the label background.
            ctx.fillStyle = "#00FFFF";
            const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
            const textHeight = parseInt(font, 10); // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      });
  
      detections.forEach(item => {
        const x = item['bbox'][0];
        const y = item['bbox'][1];
  
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(item["label"] + " " + (100*item["score"]).toFixed(2) + "%", x, y);
      });
    };

    return (
        <div className={classes.body}>
            <Grid container spacing={3}>
            {windows.map((name, index) => {
                return (
                    <Grid key={index} item xs={12} sm={6}>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <video id={'window' + index} className='screen-player' ref={videoRefs.current[index]}></video>
                            </CardActionArea>
                            <CardActions>
                                <Button variant="contained" color="primary" onClick={() => selectWindow(index)}>Start</Button>
                                <Button variant="contained" color="primary" onClick={() => removeWindow(index)}>Stop</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )
            })}
            </Grid>
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
