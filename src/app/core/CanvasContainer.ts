
export class CanvasContainer {

  public bgCtx:CanvasRenderingContext2D;
  public groundCtx:CanvasRenderingContext2D;
  public shadowCtx:CanvasRenderingContext2D;
  public mainCtx:CanvasRenderingContext2D;
  public topCtx:CanvasRenderingContext2D;

  constructor(
    public canvasBGEl:any,
    public canvasGroundEl:any,
    public canvasBGShadowEl:any,
    public canvasMainEl:any,
    public canvasTopEl:any,
  ){
    this.bgCtx = this.canvasBGEl.getContext('2d');
    this.groundCtx = this.canvasGroundEl.getContext('2d');
    this.shadowCtx = this.canvasBGShadowEl.getContext('2d');
    this.mainCtx = this.canvasMainEl.getContext('2d');
    this.topCtx = this.canvasTopEl.getContext('2d');
  }

  clearCanvas() {
    this.bgCtx.clearRect(0, 0, this.canvasBGEl.width, this.canvasBGEl.height);
    this.groundCtx.clearRect(0, 0, this.canvasGroundEl.width, this.canvasGroundEl.height);
    this.shadowCtx.clearRect(0, 0, this.canvasBGShadowEl.width, this.canvasBGShadowEl.height);
    this.mainCtx.clearRect(0, 0, this.canvasMainEl.width, this.canvasMainEl.height);
    this.topCtx.clearRect(0, 0, this.canvasMainEl.width, this.canvasMainEl.height);
  }
}
