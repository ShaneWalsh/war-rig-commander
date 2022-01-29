import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  public static RADIANCAL= 180/Math.PI;
  public static DEGREECAL= Math.PI/180;

  constructor() { }

  /**
   * The point of this method is to simplify the process of rotating an image around another image.
   * In order to draw something correctly after rotation you have to take its center point, and rotate that using the angle of the parent.
   * Then subtract half the image size to get the top left again, this is where the image needs to be drawn and rotated.
   * This is required to accurately draw a muzzle flash or bullet coming out of a turret correctly.
   * Rotate around the parents rotation point, with your rotation point,
   * then return both your final rotation cords and the topleft cords after rotating for drawing top left x+y.
   * @param parCenterX
   * @param parCenterY
   * @param point2X
   * @param point2Y
   * @param imgSizeX
   * @param imgSizeY
   * @param angle
   */
  public static topLeftAfterRotation(parCenterX, parCenterY, point2X, point2Y, imgSizeX, imgSizeY, angle) :{x:number,y:number, xR:number, yR:number} {
    let halfImageSizeX = imgSizeX/2;
    let halfImageSizeY = imgSizeY/2;
    let cords = this.pointAfterRotation(parCenterX, parCenterY, point2X + halfImageSizeX, point2Y + halfImageSizeY, angle);
    return { x: (cords.x-halfImageSizeX), y: (cords.y-halfImageSizeY), xR: cords.x, yR: cords.y };
  }

  public static pointAfterRotation(centerX, centerY, point2X, point2Y, angle) :{x:number,y:number} {
    var x1 = point2X - centerX;
    var y1 = point2Y - centerY;

    var x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
    var y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);

    var newX = x2 + centerX;
    var newY = y2 + centerY;

    return { x: newX, y: newY }; // so i can drop it straight into assignments
  }
	/**
	 * l are the actual canvas positions
	 * the translateX + Y when drawing something that is its own source of truth, e.g a turret, the defaults are fine.
	 * When calcualting the rotation of an object based off the rotation of another, eg. a bullet from a turret
	 * the translateX + Y need to be calcualted by rotating the center of the bullet, and use this rotated center as the translateX + Y
	 * and workout the x,y from the translateX + Y - sx+sy.
	 *
	 */
  public static drawRotateImage(imageObj, ctx, rotation, x, y, sx, sy, lx = x, ly = y, lxs = sx, lys = sy, translateX = x + (sx / 2), translateY = y + (sy / 2)) {
    // bitwise transformations to remove floating point values, canvas drawimage is faster with integers
    lx = (0.5 + lx) << 0;
    ly = (0.5 + ly) << 0;

    translateX = (0.5 + translateX) << 0;
    translateY = (0.5 + translateY) << 0;

    ctx.save();
    ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
    ctx.rotate(rotation);
    ctx.translate(translateX * -1, translateY * -1); // this moves the point of drawing and rotation to the center.
    ctx.drawImage(imageObj, 0, 0, sx, sy, x, y, sx, sy);

    ctx.restore();
  }

	public static drawBorder(x,y,sizeX,sizeY,ctx,color){
    ctx.lineWidth = 1;
  	ctx.strokeStyle = color;
  	ctx.strokeRect(x,y,sizeX,sizeY);
  }

  public static writeOnCanvas(x,y,text,size,color1,ctx){
    ctx.font = size + "px 'Century Gothic'"; // Supertext 01
    ctx.fillStyle = color1;
    ctx.fillText(text, x, y);
    //ctx.fill();
  }

  public static posDiff(a,b):number {
    return (a > b)? a - b:b - a;
  }

  public static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  public static radianToDegree(radians){
    var deg = radians * this.RADIANCAL;
    if(deg < 0){
        return deg+360;
    }
    else{
          return deg;
      }
  }

  public static radianToDegreeFloor(radians){
    return Math.floor(this.radianToDegree(radians))
  }

  public static degreeToRadian(degrees){
    return degrees * this.DEGREECAL;
  }

  public static Create2DArray(rows) {
    var gridA = [];
    for (var i=0;i<rows;i++) {
       gridA[i] = [];
    }
    return gridA;
  }

  public static drawPath(x,y,xx,yy,color,ctx){
    ctx.beginPath();
    ctx.moveTo(x+32, y+32);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  public static drawLine(x,y,xx,yy,color,ctx){
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  public static drawBox(x,y,sX,sY,ctx,fillColour,borderColor){
    ctx.lineWidth = 2;
    ctx.fillStyle = fillColour;
    ctx.fillRect(x, y, sX, sY);
    ctx.strokeStyle = borderColor;
    ctx.strokeRect(x,y,sX,sY);
  }

  public static drawIsoBox(x,y,sX,sY,ctx,colour){
    let hX= sX/2;
    let hY= sY/2;
    this.drawLine(x+hX,y,x+sX,y+hY,colour,ctx);
    this.drawLine(x+sX,y+hY,x+hX,y+sY,colour,ctx);
    this.drawLine(x+hX,y+sY,x,y+hY,colour,ctx);
    this.drawLine(x,y+hY,x+hX,y,colour,ctx);
  }

  /**
   * Taking in two points return a rect between the two points no mater where they are in relation to each other
   * E.g click - draging and drawing a box in between.
   * x: The top left x
   * y: The top left y
   * sx: distance from x+x2 sx
   * sy: distance from y+y2 sy
   * x2: The bottom right x2
   * y2: The bottom right y2
   * @returns
   */
  public static getRectCords(p1x,p1y,p2x,p2y):{x:number,y:number,sx:number,sy:number,x2:number,y2:number}{
    if(p1x > p2x){
      if(p1y > p2y){ // p1 is bottom right
        return {x:p2x, y:p2y, sx:p1x-p2x, sy:p1y - p2y, x2:p1x, y2:p1y}
      } else { // p1 is top right
        return {x:p2x, y:p1y, sx:p1x-p2x, sy:p2y - p1y, x2:p1x, y2:p2y}
      }
    } else { // less than
      if(p1y > p2y){ // p1 is bottom left
        return {x:p1x, y:p2y, sx:p2x-p1x, sy:p1y - p2y, x2:p2x, y2:p1y}
      } else { // p1 top left
        return {x:p1x, y:p1y, sx:p2x-p1x, sy:p2y - p1y, x2:p2x, y2:p2y}
      }
    }
  }

  /**
   * Loop around on a value
   * @param index the current index position
   * @param length the maximum value before the loop resets to 0
   * @param increment the amount to increment on each loop
   * @returns
   */
   static incrementLoop(index: number, length: number, increment:number=1): number {
    index = index+increment;
    return (index >= length)?0:index;
  }

  /**
   * checks if the postive difference between number1 + 2 is less than the shouldBeLessThan value.
   * @param number1
   * @param number2
   * @param shouldBeLessThan
   * @returns
   */
   public static isDiffLessThanCalc(number1: number, number2: number, shouldBeLessThan:number){
    var totalDiff = number1 - number2;
    if(totalDiff < 0){
      totalDiff = totalDiff*-1;
    }
    return totalDiff < shouldBeLessThan;
  }

  /**
   * checks if the postive difference between number value is less than the shouldBeLessThan value.
   * @param value
   * @param shouldBeLessThan
   * @returns
   */
  public static isDiffLessThan(value: number, shouldBeLessThan:number){
    if(value < 0){
      value = value*-1;
    }
    return value < shouldBeLessThan;
  }

  // move values from one array to another while iterating over them and running some logic
  public static moveBetweenArrays(fromArray: any[], toArray: any[], func:any) {
    for( let i = 0; i < fromArray.length; i++ ) {
      if(func(fromArray[i])){
        toArray.push(fromArray.splice(i));
        i--;
      }
    }
  }

  // https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not/37865332#37865332
  public static isPointInRectangle(m:{x,y}, r: {TL:{x,y}, TR:{x,y}, BL:{x,y}, BR:{x,y}} ):boolean {
    var AB = LogicService.vector(r.BL, r.TL);
    var AM = LogicService.vector(r.BL, m);
    var BC = LogicService.vector(r.TL, r.TR);
    var BM = LogicService.vector(r.TL, m);
    var dotABAM = LogicService.dot(AB, AM);
    var dotABAB = LogicService.dot(AB, AB);
    var dotBCBM = LogicService.dot(BC, BM);
    var dotBCBC = LogicService.dot(BC, BC);
    return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
  }
  private static vector(p1, p2) {
    return {x: (p2.x - p1.x), y: (p2.y - p1.y)};
  }
  private static dot(u, v) {
    return u.x * v.x + u.y * v.y;
  }
}



export enum HardRotationAngle {
  UP=-1.5707963267948966,
  DOWN=1.5707963267948966,
  LEFT=3.141592653589793,
  RIGHT=0,
}
