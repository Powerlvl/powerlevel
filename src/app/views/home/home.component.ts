import { Component, OnInit } from '@angular/core';
import {ViewService} from '../../_service/view.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _view: ViewService) { }

  ngOnInit() {
    this._view.changeTitle('');
  }

}
