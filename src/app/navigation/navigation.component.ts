import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-navigation',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '300px'
      })),
      state('closed', style({
        height: '0px'
      })),
      transition('open => closed', [
        animate('0.25s')
      ]),
      transition('closed => open', [
        animate('0.25s')
      ]),
    ]),
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  opened = false;
  constructor() { }

  ngOnInit() {
  }

  onMenuClick() {
    this.opened = !this.opened;
  }

}
