let mute = false;
let music = document.getElementById('music');
let flying = document.getElementById('flying');
let walkingSound = document.getElementById('walking');
let runningSound = document.getElementById('running');
let muteButton = document.getElementById('muteButton');

music.volume = 0.1;
flying.volume = 0.7;
walkingSound.volume = 0.7;
walkingSound.playbackRate = 1.4;
runningSound.volume = 0.7;
runningSound.playbackRate = 1.6;

function toggleMute(){
    if(mute){
        mute = false;
        music.play();
        muteButton.src = "/assets/textures/unmute.png";
    }
    else if(!mute){
        mute = true;
        music.pause();
        muteButton.src = "/assets/textures/mute.png";
    }
}
