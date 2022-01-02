import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MouseService {
  public static isClickListening: boolean=true;
  public static mouseX: number;
  public static mouseY: number;
  public static osl: number=0; // offsetleft
  public static ost: number=0; // offsettop

  static get leftClickSubject$(): Observable<MouseEvent> {
    return this.leftClickSubject.asObservable();
  }
  public static leftClickSubject: Subject<MouseEvent> = new Subject();

  static get rightClickSubject$(): Observable<MouseEvent> {
    return this.rightClickSubject.asObservable();
  }
  public static rightClickSubject: Subject<MouseEvent> = new Subject();

  static get leftClickReleaseSubject$(): Observable<MouseEvent> {
    return this.leftClickReleaseSubject.asObservable();
  }
  public static leftClickReleaseSubject: Subject<MouseEvent> = new Subject();

  static get rightClickReleaseSubject$(): Observable<MouseEvent> {
    return this.rightClickReleaseSubject.asObservable();
  }
  public static rightClickReleaseSubject: Subject<MouseEvent> = new Subject();

  static get doubleClickSubject$(): Observable<MouseEvent> {
    return this.doubleClickSubject.asObservable();
  }
  public static doubleClickSubject: Subject<MouseEvent> = new Subject();

  static get mouseWheelSubject$(): Observable<MouseEvent> {
    return this.mouseWheelSubject.asObservable();
  }
  public static mouseWheelSubject: Subject<MouseEvent> = new Subject();

  constructor() {}

  public static getMouseCords(){
    return new MouseCords(this.mouseX,this.mouseY,this.osl,this.ost)
  }

  public static resizeUpdateOffsets(element) {
    MouseService.osl = element.offsetLeft;
    MouseService.ost = element.offsetTop;
  }

  public static setupMouseListeners(element) {
    element.addEventListener("mousemove", MouseService.updateMousePosition.bind(MouseService), false);
    element.addEventListener("dblclick", MouseService.doubleClick.bind(MouseService), false);
    element.addEventListener("mousedown", MouseService.mouseClick.bind(MouseService), false);
    element.addEventListener("mouseup", MouseService.mouseClickRelease.bind(MouseService), false);
    element.addEventListener("wheel", MouseService.mouseWheel.bind(MouseService), false);
    element.addEventListener("contextmenu", MouseService.rightClickContext.bind(MouseService), false);
    MouseService.resizeUpdateOffsets(element);
  }

  public static updateMousePosition(e){
		this.mouseX =  Math.floor(e.pageX - this.osl);
		this.mouseY =  Math.floor(e.pageY - this.ost);
	}

	public static mouseClick(e:MouseEvent ){
    if(this.isClickListening === true){
			if(e.button == 0){
        MouseService.leftClickSubject.next(e);
			}
			else if(e.button == 2){
        MouseService.rightClickSubject.next(e);
			}
    }
  }

	public static mouseClickRelease(e){
    if(this.isClickListening === true){
      if(e.button == 0){ // left
        MouseService.leftClickReleaseSubject.next(e);
      }
      else if(e.button == 2){ // right
        MouseService.rightClickReleaseSubject.next(e);
      }
    }
  }

  public static mouseWheel(e){
    if(this.isClickListening === true){
      // scale += event.deltaY * -0.01;
      if(ConfigService.isDebug)console.log("mouseWheel",e);
			MouseService.mouseWheelSubject.next(e);
    }
  }

	public static rightClickContext(e){ // this is just a catch for the context menu, to prevent it from appearing.
		e.preventDefault();
	}

	public static doubleClick(e) {
    if(this.isClickListening === true){
      MouseService.doubleClickSubject.next(e);
    }
  }

}

export class MouseCords {
  constructor(
    public mouseX: number,
    public mouseY: number,
    public osl: number,
    public ost: number,
  ) {

  }
}
