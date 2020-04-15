let mute = false;
let music = document.getElementById('music');
let flying = document.getElementById('flying');
let muteButton = document.getElementById('muteButton');

music.volume = 0.1;
flying.volume = 0.7;

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
