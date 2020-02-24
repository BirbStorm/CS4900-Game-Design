class Enemy{
    constructor(health,damage){
        this.health = health;
        this.damage = damage;
    }
    getHealth(){
        return this.health;
    }
    takeDamage(x){
        this.health -= x;
        return this.health;
    }
}