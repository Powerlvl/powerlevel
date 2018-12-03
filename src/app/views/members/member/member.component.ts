import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-member',
  animations: [
    trigger('expand', [
      state('show', style({
        "width": '90%',
        "height": 'auto',
        margin: '0 auto'
      })),
      state('hide', style({
        "width": '400px',
        "height": 'auto',
        margin: '0 auto'
      })),
      transition('show => hide', [
        animate('0.25s')
      ]),
      transition('hide => show', [
        animate('0.25s')
      ]),
    ]),
  ],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  @Input() fullName;
  @Input() occupation;
  @Input() company;

  expanded = false;

  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCardClick() {
    this.expanded = !this.expanded;
    if(this.expanded) {
      this.onClick.emit(this.fullName);
    } else {
      this.onClick.emit(null);
    }
  }

}
