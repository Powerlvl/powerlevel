import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Cleanup} from '../cleanup';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-btn-tab-nav',
  templateUrl: './btn-tab-nav.component.html',
  styleUrls: ['./btn-tab-nav.component.scss'],
  animations: [
    trigger('btnActivated', [
      // ...
      state('active', style({
        height: '65px',
        width: '65px'
      })),
      state('inactive', style({
        height: '56px',
        width: '56px',
        'margin-bottom': '3px'
      })),
      transition('active => inactive', [
        animate('0.3s')
      ]),
      transition('inactive => active', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class BtnTabNavComponent extends Cleanup implements OnInit  {

  links = [{ path: '/', name: 'Home', icon: 'home'}, {path: '/members', name: 'Members', icon: 'face'}, {path: '/contact', name: 'Contact', icon: 'phone'}];
  activeLink;

  constructor(private router: Router) {
    super()
  }

  ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.doDestroy))
      .subscribe(
        event => {
          if(event instanceof NavigationEnd){
            this.activeLink = event.url;
            console.log(this.activeLink);
          }
        }
      )

  }

}
