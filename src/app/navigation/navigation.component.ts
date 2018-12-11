import { Component, OnInit } from '@angular/core';
import {ViewService} from '../_service/view.service';
import {Cleanup} from '../cleanup';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends Cleanup implements OnInit {

  opened = false;
  title;

  constructor(private _view: ViewService) {
    super();
  }

  ngOnInit() {
    this._view.getTitleObjservable()
      .pipe(takeUntil(this.doDestroy))
      .subscribe( title => this.title = title);
  }

  onMenuClick() {
    this.opened = !this.opened;
  }

}
