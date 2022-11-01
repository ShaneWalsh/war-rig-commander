import { LogicService } from 'src/app/services/logic.service';
import { BotMissile } from '../bot/BotMissile';
import { BotTeam } from '../bot/BotTeam';
import { Cords } from '../Cords';
import { Drawer } from '../manager/support/display/Drawer';
import { UiSettings } from '../manager/support/display/UiSettings';
import { LogicProcess } from '../manager/support/logic/LogicProcess';
import { DrawingContext, LogicContext } from '../manager/support/SharedContext';
import { Opt } from '../Opt';
import { TileEntity } from '../TileEntity';

export class LevelMap implements Drawer, LogicProcess {
  private map: MapTile[][];
  private tileSize = 32;
  private halfTileSize = this.tileSize / 2;
  private mapSizeX = 90;
  private mapSizeY = 90;

  constructor() {
    this.map = new Array();

    let randomness = Math.floor(Math.random() * 10 + 1);
    let randomnessCounter = 0;
    for (let i = 0; i < this.mapSizeX; i++) {
      this.map[i] = new Array();
      for (let j = 0; j < this.mapSizeY; j++) {
        randomnessCounter++;
        if (randomnessCounter >= randomness) {
          this.map[i][j] = new MapTile(this, i, j, '#00FFFF', false);
          randomnessCounter = 0;
          randomness = Math.floor(Math.random() * 10 + 1);
        } else {
          this.map[i][j] = new MapTile(this, i, j, '#00FF00');
        }
      }
    }
  }

  init(logicContext: LogicContext) {}
  destroy(logicContext: LogicContext) {}
  update(logicContext: LogicContext) {
    // not sure it needs to do anything?
  }

  draw(dc: DrawingContext) {
    // for(let i =0; i < this.size;i++){
    //   for(let j =0; j < this.size;j++){
    //     LogicService.drawBox(
    //       i*this.tileSize, j * this.tileSize,
    //       this.tileSize,
    //       this.tileSize,
    //       dc.cc.bgCtx,this.map[i][j],"#FFEEDD");
    //   }
    // }
    const uiSet = dc.uiSet;

    let x = 0;
    let y = 0;
    for (
      let viewX = uiSet.viewTilesStartPosX;
      viewX < this.mapSizeX && viewX < uiSet.viewTilesEndPosX;
      viewX++, x++
    ) {
      for (
        let viewY = uiSet.viewTilesStartPosY;
        viewY < this.mapSizeY && viewY < uiSet.viewTilesEndPosY;
        viewY++, y++
      ) {
        if (viewX >= 0 && viewY >= 0) {
          const tile = this.get(viewX, viewY);
          tile.draw(dc, x, y);
        }
      }
      y = 0;
    }
  }

  get(x: number, y: number): MapTile {
    return this.map[x][y];
  }

  getTiles(): MapTile[][] {
    return this.map;
  }

  getTilesWithinSensor(range: number, cords: Cords): MapTile[] {
    let tiles = [];
    let bounds = cords.getBounds(range, this.mapSizeX - 1, this.mapSizeY - 1);
    for (let i = bounds.left; i <= bounds.right; i++) {
      for (let j = bounds.up; j <= bounds.down; j++) {
        tiles.push(this.map[i][j]);
      }
    }
    return tiles;
  }

  getTileSize(): number {
    return this.tileSize;
  }
  getHalfTileSize(): number {
    return this.halfTileSize;
  }
  getMapSize(): {mapSizeX:number, mapSizeY:number} {
    return {
      mapSizeX:this.mapSizeX,
      mapSizeY:this.mapSizeY
    };
  }

  /**
   * Are the provided cords on the map somewhere? If so return the Tile underneath.
   */
  locateTile(posX: number, posY: number) : MapTile{
    let tileX = Math.floor(posX/this.tileSize);
    let tileY = Math.floor(posY/this.tileSize);
    if((tileX >= 0 && tileX <= this.mapSizeX-1) && (tileY >= 0 && tileY <= this.mapSizeY-1)) {
      return this.get(tileX,tileY);
    }
    return null;
  }

  /**
   * Has this entity hit anything on this tile?
   * Overkill maybe for a method, but adds enterception point for the future.
   */
  colisionDetection(lc: LogicContext, tile:MapTile, missile: BotMissile) {
    let entityOpt = tile.optTileEntity();
    if(entityOpt.isPresent()) {
      const entity = entityOpt.get();
      // TODO pixel colision detection logic, but perhaps the game is underpressure and drops to simple colision logic??? So maintain this logic also, add toggle.
      if(lc.levelInstance.isEnemy(missile.getBotTeam(), entity.getBotTeam())){
        missile.collisionYouHit(lc, entity);
        entity.collisionYouWereHit(lc, missile);
      }
    }
  }

}

export class MapTile {
  // terrain type for speed?
  public posX: number;
  public posY: number;
  public centerX: number;
  public centerY: number;
  // Layers of a tile. Terrain type, construct, item, entity
  public tileConstruct: TileEntity = null; // gate? bridge? train track?
  public tileItem: TileEntity = null; // lump of gold, piece of a mech, resoruces, water
  public tileEntity: TileEntity = null; // moving, thinking bot.

  public cornerCords: {
    TL: { x; y };
    TR: { x; y };
    BL: { x; y };
    BR: { x; y };
  };

  constructor(
    map: LevelMap,
    public x: number,
    public y: number,
    public color: string, // TODO replace with a terrain type
    public passable: boolean = true
  ) {
    this.updateCords(map);
  }

  // GETTER SETTER
  optTileEntity() {
    return new Opt(this.tileEntity);
  }
  removeTileEntity() {
    this.tileEntity = null;
  }
  setTileEntity(tileEntity: TileEntity) {
    this.tileEntity = tileEntity;
  }

  updateCords(map: LevelMap) {
    this.posX = this.x * map.getTileSize();
    this.posY = this.y * map.getTileSize();
    this.centerX = this.posX + map.getHalfTileSize();
    this.centerY = this.posY + map.getHalfTileSize();
    this.cornerCords = {
      TL: { x: this.posX, y: this.posY },
      TR: { x: this.posX + map.getTileSize(), y: this.posY },
      BL: { x: this.posX, y: this.posY + map.getTileSize() },
      BR: {
        x: this.posX + map.getTileSize(),
        y: this.posY + map.getTileSize(),
      },
    };
  }
  getCenterX() {
    return this.centerX;
  }
  getCenterY() {
    return this.centerY;
  }
  getCords(): Cords {
    return new Cords(this.x, this.y);
  }
  getCornerCords(): { TL: { x; y }; TR: { x; y }; BL: { x; y }; BR: { x; y } } {
    return this.cornerCords;
  }
  /**
   * The top left position of the first and main tile. Adjusted for ui offset movement.
   * Could be used for accurate drawing.
   */
  getUiCords(uiSet: UiSettings): { x: number; y: number } {
    return {
      x: this.x * uiSet.tileSize - uiSet.curX,
      y: this.y * uiSet.tileSize - uiSet.curY,
    };
  }

  getTraverseStatus(): TraverseStatus {
    // TODO update this object when things change rather than building it every time.
    let entityOccupied = false;
    let entityTeam = null;
    if( this.optTileEntity().isPresent() ) {
      entityOccupied = true;
      entityTeam = this.optTileEntity().get().getBotTeam()
    }

    return new TraverseStatus(
      this,
      this.passable,
      entityOccupied,
      entityTeam,
      false
    );
  }

  draw(dc: DrawingContext, x, y) {
    const uiSet = dc.uiSet;
    LogicService.drawBox(
      x * uiSet.tileSize - uiSet.viewXOffset,
      y * uiSet.tileSize - uiSet.viewYOffset,
      uiSet.tileSize,
      uiSet.tileSize,
      dc.cc.bgCtx,
      this.color,
      '#FFEEDD'
    );
    this.tileEntity?.draw(dc);
  }
}

export class TraverseStatus {
  // maybe add speed slowdown/speed up? or the max speed the terrain supports?

  constructor(
    public tile: MapTile,
    public passable: boolean = true,
    public entityOccupied: boolean = false,
    public entityTeam: BotTeam = null,
    public entityCrushable: boolean = false
  ) {}
}

// add options support, so some of the logic can be overridden, like ignore everything, because its invincible or something.
// or its desprite, or it can do ram damage and so will happily charge into any opposing team bot.
// tile entities can implment this differently
// The point being basically, what does this entity consider to be a passable tile, at this time.
export interface TraversalComp {
  canPassTerrain(mapTile:MapTile, options);
  canPassEntity(tileEntity:TileEntity, options);
}
