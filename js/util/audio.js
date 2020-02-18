let mute = false;

function toggleMute(){
    if(mute){
        mute = false;
        document.getElementById('music').play();
    }
    else if(!mute){
        mute = true;
        document.getElementById('music').pause();
    }
}
