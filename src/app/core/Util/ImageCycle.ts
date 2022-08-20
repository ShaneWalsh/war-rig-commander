import { LogicService } from "src/app/services/logic.service";
import { Limiter } from "../Limiter";


export class ImageCycle {
  limiter: Limiter;
  currentIndex: number = 0;

  constructor(
    public images:HTMLImageElement[],
    public rateOfRotation:number = 5,
    public startingIndex = 0
  ){
    this.currentIndex = startingIndex;
    this.limiter = new Limiter(rateOfRotation,0,1);
  }

  update():HTMLImageElement{
    if(this.limiter.update()){
      this.currentIndex = LogicService.incrementLoop(this.currentIndex,this.images.length,1);
      this.limiter.reset();
    }
    return this.images[this.currentIndex];
  }

  reset(){
    this.currentIndex = this.startingIndex;
    this.limiter.reset();
  }
}

// Hack class for simplicity
export class ImageFlat extends ImageCycle {
  constructor(
    public singleImage:HTMLImageElement
  ){
    super([]);
  }

  update():HTMLImageElement{
    return this.singleImage;
  }

  reset(){}
}
