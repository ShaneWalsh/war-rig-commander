import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rig-hold',
  templateUrl: './rig-hold.component.html',
  styleUrls: ['./rig-hold.component.css']
})
export class RigHoldComponent implements OnInit {

  // It sorta feels like this might need to be more custom though.

  constructor() { }

  ngOnInit(): void {
  }

  inventory:any[] = [
    "missile",
    "cannon"
  ];

  leftTorso:any[] = [
  ];


  dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  }
  dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  drop_handler(ev) {
    ev.preventDefault();
    console.log(ev);
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("application/my-app");
    ev.target.appendChild(document.getElementById(data));
    // TODO, ensure the drop location is one of the droppable zone ids, else objects will end up stuck togeather.
    // ev.target.parentElement.id
  }

}
