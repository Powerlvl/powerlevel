import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  @Input() fullName;
  @Input() occupation;
  @Input() company;
  @Input() member;

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
