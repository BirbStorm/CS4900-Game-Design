let mute = false;
let music = document.getElementById('music');
let muteButton = document.getElementById('muteButton');

music.volume = 0.02;
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
