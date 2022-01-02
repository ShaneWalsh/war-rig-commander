import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardEventService {

  private subject: Subject<CustomKeyboardEvent>; // all events
  private subjectKeyDown: Subject<CustomKeyboardEvent>;
  private subjectKeyUp: Subject<CustomKeyboardEvent>;

  // add a map to only trigger the key down once, then /// <reference path="
  private keyPressedMap:Map<string,KeyboardEvent> = new Map();

  constructor() {
    this.subject = new Subject<CustomKeyboardEvent>();
    this.subjectKeyDown = new Subject<CustomKeyboardEvent>();
    this.subjectKeyUp = new Subject<CustomKeyboardEvent>();
    this.keyPressedMap = new Map();
  }

  getKeyboardEventSubject():Subject<CustomKeyboardEvent>{
    return this.subject;
  }

  getKeyDownEventSubject():Subject<CustomKeyboardEvent>{
    return this.subjectKeyDown;
  }

  getKeyUpEventSubject():Subject<CustomKeyboardEvent>{
    return this.subjectKeyUp;
  }

  publishKeyboardUpEvent(event:KeyboardEvent){
    if(this.keyPressedMap.has(event.code)){
      const keyboardEvent = new CustomKeyboardEvent(event);
      this.getKeyboardEventSubject().next(keyboardEvent);
      this.getKeyUpEventSubject().next(keyboardEvent);
      this.keyPressedMap.delete(event.code);
    }
  }

  publishKeyboardDownEvent(event:KeyboardEvent){
    if(!this.keyPressedMap.has(event.code)){
      const keyboardEvent = new CustomKeyboardEvent(event);
      this.getKeyboardEventSubject().next(keyboardEvent);
      this.getKeyDownEventSubject().next(keyboardEvent);
      this.keyPressedMap.set(event.code,event);
    }
  }

  clearKeyPressMap(){
    this.keyPressedMap = new Map();
  }
}


export class CustomKeyboardEvent {
  constructor(public event:KeyboardEvent){

  }
}
