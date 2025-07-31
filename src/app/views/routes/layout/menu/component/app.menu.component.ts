import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Menu } from 'src/app/_models/menu';
import { User } from 'src/app/_models/user';
import { AuthenticationService } from 'src/app/_services';
import { AppConfigService } from 'src/app/_services/configuration.services';
import { LocalStorageService } from 'src/app/_shared/storage.service';
import { RouteIndexComponent } from '../../../route-index/route-index.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    currentUserData: User;


    model: Menu[] = [];

    constructor(public app: RouteIndexComponent,
        private config: AppConfigService,
        private auth: AuthenticationService,
        private storage: LocalStorageService) { }

    ngOnInit() {
        this.config.load().then((k: Menu[]) => {
            var userData = this.auth.currentUserValue;
            console.log(userData, "login Data");
            //main menu filtering
            let data = k.filter((m) => m.privilages.find(x => x == userData.workgroupid));
            //level 1 filtering
            data.forEach((v, i, arry) => {
                if (v.items != null && v.items?.length > 0) {
                    if (v.items.filter(v => v.privilages != null && v.privilages.length > 0)) {
                        const data = v.items.filter(n => n.privilages?.find(m => m == userData.workgroupid));
                        if (data?.length > 0) {
                            arry[i].items = data;
                            // level2 filtering
                            arry[i].items.forEach((cv, ci, carrry) => {
                                if (cv?.items != null && cv.items?.length > 0) {
                                    if (cv.items.filter(v => v.privilages != null && v.privilages.length > 0)) {
                                        const data2 = cv.items.filter(n => n.privilages?.find(m => m == userData.workgroupid));
                                        if (data2?.length > 0) {
                                            carrry[ci].items = data2;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });

            console.log(data);

            this.model = data;
            // this.model = data;
            console.log(k);
        });
    }

    changeTheme(theme) {
        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const href = 'assets/theme/theme-' + theme + '.css';

        this.replaceLink(themeLink, href);
    }
    changeLayout(layout) {
        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const href = 'assets/layout/css/layout-' + layout + '.css';

        this.replaceLink(layoutLink, href);
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);
            });
        }
    }

    onMenuClick() {
        this.app.onMenuClick();
    }
}
