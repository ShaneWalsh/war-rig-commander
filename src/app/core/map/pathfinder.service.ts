import { Injectable } from '@angular/core';
import { LevelMap } from './LevelMap';

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  constructor() { }

  // todo for multi sized bots that take more than one tile, I just need to change the isPassalbe call in the logic, to check all of the 4 squares, not just the top left,
  // if any of them are impassiable, then its a failure for that top left calculation isn't it.

  /**
   * Extracted from a former project from nearly 10 years ago
   * Needs Heavy refactoring.
   * Works for a single tile size element, not larger elements.
   * @param x starting x
   * @param y starting y
   * @param xx target x
   * @param yy target y
   * @param originalMap
   * @returns
   */
  public static getSinglePath (x,y, xx,yy, originalMap:LevelMap):MoveNode[] {
    // use A* to find the shortest path, return an array of nodes to move to
    var n = 0;
    var disx = this.positiveDifference(x,xx);
    var disy = this.positiveDifference(y,yy);
    let map = this.create2DArrayForMapped(originalMap.getTiles().length, originalMap.getTiles()[0].length);

    let open = []; // open and closed list for A* pathfinding
    let closed:MoveNode[] = [];

    var h = disx + disy + n;
    open.push(new MoveNode(x,y,n,h)); // opening node
    map[x][y].maped = true;

    // function to check for passability
    let checkPosition = (posX,posY) => {
      let m = originalMap.get(posX,posY);
      if( m != null && m.passable && map[posX][posY].maped === false){ // floor or door? and it has not been maped yet
        disx = this.positiveDifference(posX,xx); 	// this will make sure the difference is a positive, or a zero :/
        disy = this.positiveDifference(posY,yy);
        var node = new MoveNode(posX,posY,n,(disx + disy + n));//create a new node, set values
        open.push(node);// add to open list
        map[posX][posY].maped = true;// mark as maped
      }
      else { // not a floor or door, dont add to closed, mark as maped
        map[posX][posY].maped = true;
      }
    }

    while(open[0].x != xx || open[0].y != yy){ // while the goal state is not in open position 0, keep searching
      closed.push(open.shift());	// remove first element, add it to the end of the closed list :p
      n = closed[closed.length-1].n; n++;// increase n based on open element's n
      x = closed[closed.length-1].x;
      y = closed[closed.length-1].y;

      if (x +1 < originalMap.getTiles().length ) checkPosition(x+1,y);
      if (x-1 > -1) checkPosition(x-1,y);
      if (y+1 < originalMap.getTiles()[x].length) checkPosition(x,y+1);
      if (y-1 > -1) checkPosition(x,y-1);

      open.sort((a,b)=>a.h - b.h); // sort and repeat until the goal is found eh?
      if(open.length === 0){ // then the target is not reachable
        return null;
      }
    } // when it ends the first element must be the goal tile
    closed.push(open.shift()); // now the goal is the final state in the closed list
    //closed.splice(0,1); // remove the very first element in closed list, as it is the starting position, // this is for the ai's benifit
    closed.reverse(); // for the loop, start at the end and work back using the n values to isolate the correct nodes
    for(var k = 0; k < closed.length-1; k++){//back track and remove all of the nodes I dont need, start at the end and work back, or reverse and start at the begining, each node after current not within 1X1 around it with a lower n value must be removed, then I will have one straight list of node positons to the goal
      var nodeClosed = closed[k];
      x = nodeClosed.x; y = nodeClosed.y;
      var next = false;
      while(next === false){ // keep going until I find the start node again
        var nextNode = closed[k+1];
        if(x+1 === nextNode.x && y === nextNode.y && nodeClosed.n > nextNode.n){
          next = true;
        }
        else if(x-1 === nextNode.x && y === nextNode.y && nodeClosed.n > nextNode.n){
          next = true;
        }
        else if(x === nextNode.x && y-1 === nextNode.y && nodeClosed.n > nextNode.n){
          next = true;
        }
        else if(x === nextNode.x && y+1 === nextNode.y && nodeClosed.n > nextNode.n){
          next = true;
        }
        if(next === false){ // then I did not find it in the 1X1 around, remove it
          closed.splice(k+1,1); // remove k from the yoke
        }
        else{ // dont need to do anything, the other loop will move things along

        }
      }
    }
    closed.reverse() ;// so an enemy ai can use it to as a targeting system
    return closed;
  }

  private static positiveDifference(a,b):number {
    return (a > b)? a - b:b - a;
  }

  private static create2DArrayForMapped(rowsX,rowsY) {
    var gridA = [];
    for (var i=0;i<rowsX;i++) {
       gridA[i] = [];
       for (var j=0;j<rowsY;j++) {
        gridA[i][j] = {maped:false};
     }
    }
    return gridA;
  }

  public static getHeadingDirection(current:{x,y},target:{x,y}):HeadingDirection {
    if(target.x > current.x) {
      return (target.y > current.y)? HeadingDirection.BR : (target.y < current.y)? HeadingDirection.TR : HeadingDirection.RIGHT;
    } else if(target.x < current.x) {
      return (target.y > current.y)? HeadingDirection.BL : (target.y < current.y)? HeadingDirection.TL : HeadingDirection.LEFT;
    } else {
      return (target.y > current.y)? HeadingDirection.BOTTOM : (target.y < current.y)? HeadingDirection.TOP : HeadingDirection.NA;
    }
  }
}

class MoveNode {
  constructor(
    public x,
    public y,
    public n,// distance from start
    public h // total value n + distance to end node
    ){ }
}

// TL, T, TR
// L, NA, R
// BL, B, BR
export enum HeadingDirection {
  TL="TL",
  TOP="TOP",
  TR="TR",
  LEFT="LEFT",
  NA="NA",
  RIGHT="RIGHT",
  BL="BL",
  BOTTOM="BOTTOM",
  BR="BR"
 }
