import { Component, OnInit } from '@angular/core';
import { MenuService } from '../layout/menu/service/app.menu.service';
import { SettingsService } from 'src/app/_shared/settings.service';

@Component({
  selector: 'app-route-index',
  templateUrl: './route-index.component.html',
  styleUrls: ['./route-index.component.scss']
})
export class RouteIndexComponent  {

  public menuMode;

  public menuActive;

  public topbarMenuActive;

  activeTopbarItem: Element;

  menuClick: boolean;

  menuButtonClick: boolean;

  topbarMenuButtonClick: boolean;

  menuHoverActive: boolean;


  public topbarlangActive;

  topbarlangButtonClick: boolean;
  

  constructor(private menuService: MenuService, public settings: SettingsService) {
      this.menuMode = settings.getOptions().menuMode;
      this.menuActive = settings.getOptions().menuActive;
      this.topbarMenuActive = settings.getOptions().topbarMenuActive;
  }

  
  onMenuButtonClick(event: Event) {
      this.menuButtonClick = true;
      this.menuActive = !this.menuActive;
      event.preventDefault();
  }

  onTopbarMenuButtonClick(event: Event) {
      this.topbarMenuButtonClick = true;
      this.topbarMenuActive = !this.topbarMenuActive;
      event.preventDefault();
  }

  onTopbarItemClick(event: Event, item: Element) {
      this.topbarMenuButtonClick = true;

      if (this.activeTopbarItem === item) {
        this.activeTopbarItem = null;
      } else {
        this.activeTopbarItem = item;
      }
      event.preventDefault();
  }

  onTopbarSubItemClick(event) {
      event.preventDefault();
  }

  
  onLayoutClick() {
      if (!this.menuButtonClick && !this.menuClick) {
          if (this.menuMode === 'horizontal') {
            //   this.menuService.reset();
          }

          if (this.isMobile() || this.menuMode === 'overlay' || this.menuMode === 'popup') {
              this.menuActive = false;
          }

          this.menuHoverActive = false;
      }

      if (!this.topbarMenuButtonClick) {
          this.activeTopbarItem = null;
          this.topbarMenuActive = false;
      }

      this.menuButtonClick = false;
      this.menuClick = false;
      this.topbarMenuButtonClick = false;
  }



  onMenuClick() {
      this.menuClick = true;
  }

  isMobile() {
      return window.innerWidth < 1025;
  }

  isHorizontal() {
      return this.menuMode === 'horizontal';
  }

  isTablet() {
      const width = window.innerWidth;
      return width <= 1024 && width > 640;
  }
}
