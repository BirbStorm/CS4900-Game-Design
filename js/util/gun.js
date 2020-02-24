class Gun{
    constructor(damage,capacity,reloadSpeed,rateOfFire,bool){
        this.damage = damage;
        this.capacity = capacity;
        this.reloadSpeed = reloadSpeed;
        this.rateOfFire = rateOfFire;
        this.automatic = false;
        if(bool)this.automatic = true;
    }
    getDamage(){
        return this.damage;
    }
    getCapacity(){
        return this.capacity;
    }
    getReloadSpeed(){
        return this.reloadSpeed;
    }
    getRateOfFire(){
        return this.rateOfFire;
    }
    isAutomatic(){
        return this.automatic;
    }
}