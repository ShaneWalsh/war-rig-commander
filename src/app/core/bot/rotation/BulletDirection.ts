import { LogicService } from "src/app/services/logic.service";

export class BulletDirection {
  constructor(
    public directionY,
    public directionX,
    public angle,
    public len,
    public speed,
    public performRotation,
    public targetObject
  ){    }

  update(origX=0, origY=0, newTarget = null){
    if(newTarget != null){
      this.targetObject = newTarget;
    }
    if(this.targetObject != null && this.targetObject != undefined && this.targetObject.posY != undefined && this.targetObject.posX != undefined){

      // TODO before updating the direction, check if we have reached the target destinataion, if we have then we have to keep moving forward
      // add logic that if we reach the center of the target, to remove the target and keep moving.

      var directionY = this.targetObject.getCenterY()-origY;
      var directionX = this.targetObject.getCenterX()-origX;
      // if we are within one final push, then dont keep recalcualting, just go straight.
      if( LogicService.isDiffLessThan(directionY,this.speed) && LogicService.isDiffLessThan(directionX,this.speed)){
        this.targetObject = null;
      } else { // do normal targeting.
        var angle = Math.atan2(directionY,directionX); // bullet angle

        // Normalize the direction
        var len = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= len;
        directionY /= len;

        this.len = len;
        this.angle = angle;
        this.directionY = directionY;
        this.directionX = directionX;
      }
    } else {
      //console.error("Cannot target this object.",this.targetObject);
    }
  }

  canShoot():boolean{
    return true;
  }

  public static calculateBulletDirection(origX:number, origY:number, targetX:number, targetY:number, speed:number, performRotation=false, targetObject:any=null):BulletDirection {
    var directionY = targetY-origY;
    var directionX = targetX-origX;
    var angle = Math.atan2(directionY,directionX); // bullet angle
    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new BulletDirection(directionY,directionX,angle,len,speed, performRotation,targetObject);
  }

}


export class TurretDirection extends BulletDirection {
  public angDiff: number = 0;
  public degreeChange: number = 1;

  constructor(
     directionY,
     directionX,
     angle,
     len,
     speed,
     performRotation,
     targetObject
  ){
    super(directionY,directionX,angle,len,speed,performRotation,targetObject)
   }

  update(origX=0, origY=0, newTarget = null){
    if(newTarget != null){
      this.targetObject = newTarget;
    }
    if(this.targetObject != null && this.targetObject != undefined && this.targetObject.posY != undefined && this.targetObject.posX != undefined){
      var directionY = this.targetObject.getCenterY()-origY;
      var directionX = this.targetObject.getCenterX()-origX;
      var angle = Math.atan2(directionY,directionX); // bullet angle

      // Normalize the direction
      var len = Math.sqrt(directionX * directionX + directionY * directionY);
      directionX /= len;
      directionY /= len;

      let currentAngleDeg = LogicService.radianToDegree(this.angle);
      let newAngleDeg = LogicService.radianToDegree(angle);
      this.angDiff = currentAngleDeg-newAngleDeg;
      if(this.angDiff > 360){
        console.log("this should not be happening:"+this.angDiff);
      }
      if(this.angDiff != 0 && (this.angDiff > 0.9 || this.angDiff < -0.9)){
        if(this.angDiff < 0){
          if(this.angDiff < -180) {
            angle = LogicService.degreeToRadian(this.decreaseAngle(currentAngleDeg))
          } else { // its > than 180 so i may as well go the opposite direction
            angle = LogicService.degreeToRadian(this.increaseAngle(currentAngleDeg))
          }
        } else {
          if(this.angDiff > 180) {
            angle = LogicService.degreeToRadian(this.increaseAngle(currentAngleDeg))
          } else { // its < than 180 so i may as well go the opposite direction
            angle = LogicService.degreeToRadian(this.decreaseAngle(currentAngleDeg))
          }
        }
      }

      this.len = len;
      this.angle = angle;
      this.directionY = directionY;
      this.directionX = directionX;
    } else {
      //console.error("Cannot target this object.",this.targetObject);
    }
  }

  increaseAngle(currentAngleDeg):number{
    currentAngleDeg = currentAngleDeg+this.degreeChange;
    return (currentAngleDeg > 360)?1:currentAngleDeg;
  }
  decreaseAngle(currentAngleDeg):number{
    currentAngleDeg = currentAngleDeg-this.degreeChange;
    return (currentAngleDeg < 0)?359:currentAngleDeg;
  }

  canShoot(diffPos=0.9, diffNeg=-0.9):boolean {
    return this.angDiff < diffPos && this.angDiff > diffNeg;
  }

  public static calculateTurretDirection(origX:number, origY:number, targetX:number, targetY:number, speed:number, performRotation=false, targetObject:any=null):TurretDirection {
    var directionY = targetY-origY;
    var directionX = targetX-origX;
    var angle = Math.atan2(directionY,directionX); // bullet angle
    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new TurretDirection(directionY,directionX,angle,len,speed, performRotation,targetObject);
  }
}
