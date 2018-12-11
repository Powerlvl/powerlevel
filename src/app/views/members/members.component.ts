import { Component, OnInit } from '@angular/core';
import {ViewService} from '../../_service/view.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  selected = null;
  members = [
    {fullName: 'Oscar Lantz', occupation: 'Consultant', company: 'Oscar Lantz Consulting AB', description: "Oscar Short Description", img: 'assets/img/oscar.jpg'},
    {fullName: 'Johan Burström', occupation: 'Consultant', company: 'Burström Consulting AB', description: "Johan Short Description", img: 'assets/img/johan.jpg'},
    {fullName: 'Jimmie Van Eijsden', occupation: 'Consultant', company: 'Eijsden AB', description: "Jimmie Short Description", img: 'assets/img/jimmie.jpg'},
    {fullName: 'Dennis Persson', occupation: 'Consultant', company: 'Dennis Person AB', description: "Dennis Short Description", img: 'assets/img/dennis.jpg'},
  ];
  constructor(private _view: ViewService) { }

  ngOnInit() {
    this._view.changeTitle('Members');
  }

  onMemberClick(memberName) {
    this.selected = memberName;
  }

  shouldShow(name) {
    return !this.selected || this.selected == name;
  }

}
