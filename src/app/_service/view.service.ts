import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private title = new EventEmitter<string>();

  constructor() { }

  changeTitle(newTitle){
    this.title.emit(newTitle);
  }

  getTitleObjservable(){
    return this.title;
  }
}
