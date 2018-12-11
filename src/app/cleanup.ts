import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

export class Cleanup implements OnDestroy {

  public doDestroy = new Subject();

  ngOnDestroy(): void {
    this.doDestroy.next(true);
    this.doDestroy.complete();
  }

}
