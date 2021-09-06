import React, { useRef, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
    'window2',
    'window3',
    'window4',
]

const Room = () => {
    const classes = useStyles();
    const streams = [];

    const videoRefs = useRef([])
    videoRefs.current = windows.map((title, i) => videoRefs.current[i] ?? createRef());

    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }

    const removeWindow = (index) => {
        streams[index].getTracks().forEach((track) => {
            track.stop();
        });
    }
    
    const selectWindow = (index) => {
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
        })
        .then(stream => {
            streams[index] = stream;
            addVideoStream(videoRefs.current[index].current, stream);
        });
    } 

    return (
        <div className={classes.body}>
            <Grid container spacing={3}>
            {windows.map((name, index) => {
                return (
                    <Grid key={index} item xs={12} sm={6}>
                        <Card className={classes.root}>
                            <CardActionArea>
                                <video className='screen-player' ref={videoRefs.current[index]}></video>
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
        </div>
    );
}

export default Room;
