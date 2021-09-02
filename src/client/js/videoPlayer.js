const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const time = document.querySelector("#time");
const volumeRange = document.querySelector("#volume");

let volumeValue = 0.5
video.volume = volumeValue;
const handlePlayClick = (e) =>{
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Paused";
}

const handleMuteClick = (e) =>{
    if(video.muted){
        video.muted = false;
    }else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmuted" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolume = (event) => {
    const {target : {value}} = event;
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    
    video.volume = value;
    volumeValue = value
}


playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolume);