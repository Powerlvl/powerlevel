import { Component, OnInit } from '@angular/core';
import {ViewService} from '../../_service/view.service';
import  {OSCAR, JOHAN, JIMMIE, DENNIS} from '../../../assets/static/members';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  selected = null;
  viewReady = false;
  members = [
    OSCAR,
    JOHAN,
    JIMMIE,
    DENNIS,
  ];
  constructor(private _view: ViewService) { }

  ngOnInit() {
    this._view.changeTitle('Members');
    this.viewReady = true;
  }

  onMemberClick(memberName) {
    this.selected = memberName;
  }

  shouldShow(name) {
    return !this.selected || this.selected == name;
  }

}
