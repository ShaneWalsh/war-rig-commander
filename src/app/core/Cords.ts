
export class Cords {
  constructor(public x:number, public y:number){}

  getBounds(distance:number,maxWidth:number, maxHeight:number):Bounds{
    let tmpLeft = this.x-distance;
    tmpLeft = tmpLeft < 0? 0:tmpLeft;

    let tmpRight = this.x+distance;
    tmpRight = tmpRight > maxWidth? maxWidth:tmpRight;

    let tmpUp = this.y-distance;
    tmpUp = tmpUp < 0? 0:tmpUp;

    let tmpDown = this.y+distance;
    tmpDown = tmpDown > maxHeight? maxHeight:tmpDown;
    return new Bounds(tmpLeft,tmpRight,tmpUp,tmpDown);
  }
}

export class Bounds {
  constructor(public left:number,public right:number,public up:number,public down:number){}
}
