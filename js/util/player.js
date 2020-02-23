class Player{
    constructor(model){
        this.currentHealth = 10;
        this.maxHealth = 10;
        this.model = model.userData.gunDamage;
        this.damage = Number(model.userData.gunDamage);
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
        return this.damage;
    }
    changeGun(){
        this.damage = Number(this.model.userData.gunDamage);
    }
}
