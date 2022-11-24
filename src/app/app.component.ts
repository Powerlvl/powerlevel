import { LayoutService } from './layout.service';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'powerlevel';

  @ViewChild(TemplateRef)
  template!: TemplateRef<any>;

  public info!: {
    name: string, description: string, img: string, username: string;
  } | null;
  constructor(readonly bottomSheet: MatBottomSheet, private layoutService: LayoutService) {
    layoutService.showObserver$.subscribe((info: any) => !!info ? this.openInfo(info) : this.closeInfo());
  }
  ngOnInit(): void {
  }


  public openInfo(info: any) {
    this.info = info;
    return this.bottomSheet.open(this.template, {
      hasBackdrop: false,
      autoFocus: false
    });
  }

  closeInfo() {  
    this.bottomSheet.dismiss(); 
  }
}


