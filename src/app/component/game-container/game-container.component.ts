import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DisplayManagerService } from 'src/app/core/manager/display-manager.service';
import { LevelManagerService } from 'src/app/core/manager/level-manager.service';
import { MouseService } from 'src/app/services/mouse.service';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }
    private subs:Subscription[] = [];

    @ViewChild('canvasBG') public canvasBG: ElementRef;
    @ViewChild('canvasGround') public canvasGround: ElementRef;
    @ViewChild('canvasBGShadow') public canvasBGShadow: ElementRef;
    @ViewChild('canvas') public canvasMain: ElementRef;
    @ViewChild('canvasTop') public canvasTop: ElementRef;

    tickComplete:boolean=true;

    @Input() public requestAnimFrame: any;

    constructor(private levelManagerService:LevelManagerService, private displayManagerService:DisplayManagerService) {
      this.subs.push(this.levelManagerService.getGameTickSubject().subscribe(result => {
        if(this.tickComplete){
            this.update();
        }
      }));
    }

    ngOnInit() {

    }

    //https://stackoverflow.com/questions/51214548/angular-5-with-canvas-drawimage-not-showing-up
    public ngAfterViewInit() {
      this.displayManagerService.setCanvasElements(this.canvasBG,this.canvasGround,this.canvasBGShadow,this.canvasMain,this.canvasTop);
      MouseService.setupMouseListeners(this.canvasTop.nativeElement);
      this.levelManagerService.unPauseGame();
    }

    public update() {
      this.tickComplete = false;
      // execute logic first? Add logic manager and wire in logic executors, and let them run before drawing.
      this.displayManagerService.update();
      this.tickComplete = true;
    }

}
