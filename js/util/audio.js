let mute = false;
let music = document.getElementById('music');

function toggleMute(){
    if(mute){
        mute = false;
        music.play();
    }
    else if(!mute){
        mute = true;
        music.pause();
    }
}
