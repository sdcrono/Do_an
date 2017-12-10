import { NgModule } from '@angular/core';
import { AboutPage } from './about';
import { IonicPageModule } from 'ionic-angular';
import { AgmCoreModule } from "@agm/core";


@NgModule({
    declarations:[AboutPage],
    imports: [IonicPageModule.forChild(AboutPage), 
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAepYGvisNRywBmOOV3d2_T-9wPBZVy9gM',
        libraries: ["places","geometry"]
        // language: 'vi',
        // region: 'VI' 
    }),],
    entryComponents: [AboutPage]
})
export class AboutPageModule {

}