import { player } from '../index2.js'
import * as control from 'controls.js'
class Player{
    
    constructor(model){
        this.currentHealth = 10;
        this.maxHealth = 10;
        this.model = model.userData.gunDamage;
        this.gun = {
            damage = 2,
            capacity = 10,
            reloadSpeed = 1,
            rateOfFire = 1,
            automatic = true
        };
    }
    getHealth(){
        return this.currentHealth;
    }
    changeMaxHealth(x){
        this.maxHealth += x;
        this.currentHealth = this.maxHealth;
    }
    takeDamage(x){
        this.currentHealth -= x;
        return this.currentHealth;
    }
    Heal(x){
        this.currentHealth += x;
        if(this.currentHealth >this.maxHealth){
            this.currentHealth = this.maxHealth;
        }
    }
    getDamage(){
        return this.gun.damage;
    }
    changeGun(x){
        this.gun = x
    }
    activateAllActions(){
        let i
        for (i = 0; i < actions.length; i++) {
            setWeight(actions[i], 0.0);
        }
        setWeight(idleAction, 1.0);
    
        //Sets ceratin actions to only play once
        jumpAction.setLoop(THREE.LoopOnce);
        walkJumpAction.setLoop(THREE.LoopOnce);
        punchAction.setLoop(THREE.LoopOnce);
        deathAction.clampWhenFinished = true;
        deathAction.setLoop(THREE.LoopOnce);
        
    
        actions.forEach( function ( action ) {
            action.play();
        } );
    }
    
    prepareCrossFade( startAction, endAction, defaultDuration ){
        var duration = defaultDuration;
        if (startAction === idleAction){
            executeCrossFade(startAction, endAction, duration)
        } else{
            synchronizeCrossFade(startAction, endAction, duration);
        }
    }
    
    synchronizeCrossFade(startAction, endAction, duration){
        playerMixer.addEventListener('loop', onLoopFinished);
        function onLoopFinished(event){
            if (event.action === startAction){
                playerMixer.removeEventListener('loop', onLoopFinished);
                executeCrossFade(startAction, endAction, duration);
            }
        }
    }
    
    executeCrossFade(startAction, endAction, duration){
        setWeight(endAction, 1);
        endAction.time = 0;
        startAction.crossFadeTo(endAction, duration, true);
    }
    
    setWeight(action, weight){
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }
    
}
