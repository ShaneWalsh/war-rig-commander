
export class Limiter {

  constructor( public limit:number,public currentValue:number=0, public incrementValue:number=1) {}

  // returns true when the currentValue is at the limit
  update() : boolean {
    if(this.currentValue < this.limit){
      this.currentValue += this.incrementValue;
    }
    return this.atLimit();
  }

  atLimit():boolean {
    if(this.currentValue >= this.limit) return true;
    return false;
  }

  reset(newValue=0){
    this.currentValue = newValue;
  }

}

