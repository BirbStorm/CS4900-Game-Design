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
}
