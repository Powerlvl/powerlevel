import { Component, OnInit } from '@angular/core';
import {ViewService} from '../../_service/view.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(private _view: ViewService) { }

  ngOnInit() {
    this._view.changeTitle('Contact');
  }

  sendMail(){
    }
}
