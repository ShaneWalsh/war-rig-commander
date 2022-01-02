import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { KeyboardEventService } from './services/keyboard-event.service';
import { LevelManagerService } from './core/manager/level-manager.service';
import { ResizeService } from './services/resize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Colony-Quest';
  public loaded:boolean=true;
  public elem;// for full screen

  // when doing the ng build make sure to change <base href="./"> in index.html
  // ng build --prod --base-href ./
  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
      if(this.loaded)
      this.keyboardEventService.publishKeyboardUpEvent(event);
  }
  @HostListener('window:keydown', ['$event'])
  keydownEvent(event: KeyboardEvent) {
      if(this.loaded)
      this.keyboardEventService.publishKeyboardDownEvent(event);
  }
  @HostListener('window:resize', ['$event'])
  resizeEvent(event: KeyboardEvent) {
      if(this.loaded)
      ResizeService.publishResizeEvent(event);
  }
  @HostListener('window:fullscreenchange', ['$event'])
  fullscreenchangeEvent(event: KeyboardEvent) {
      if(this.loaded)
      ResizeService.publishFullscreenchangeEvent(event);
  }

  public requestAnimFrame:any; // have to ensure this is not created multiple times!

  constructor(@Inject(DOCUMENT) private document: any, private levelManagerService:LevelManagerService, private keyboardEventService:KeyboardEventService) {
    this.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
                       window["mozRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"]
                       || function(callback) { window.setTimeout(callback,1000/60);};
    this.update();
  }

  ngOnInit() {
    // for full screen logic.
    this.elem = document.documentElement;
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {/* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {/* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {/* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {/* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {/* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {/* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  update() {
    this.levelManagerService.getGameTickSubject().next();
    this.requestAnimFrame(this.update.bind(this)); // takes a function as para, it will keep calling loop over and over again
  }

}

