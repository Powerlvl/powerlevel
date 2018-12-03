import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  selected = null;
  members = [
    {fullName: 'Oscar Lantz', occupation: 'Consultant', company: 'Oscar Lantz Consulting AB'},
    {fullName: 'Johan Burström', occupation: 'Consultant', company: 'Burström Consulting AB'},
    {fullName: 'Jimmie Van Eijsden', occupation: 'Consultant', company: 'Eijsden AB'},
    {fullName: 'Dennis Persson', occupation: 'Consultant', company: 'Dennis Person AB'},
  ];
  constructor() { }

  ngOnInit() {}

  onMemberClick(memberName) {
    this.selected = memberName;
  }

  shouldShow(name) {
    return !this.selected || this.selected == name;
  }

}
