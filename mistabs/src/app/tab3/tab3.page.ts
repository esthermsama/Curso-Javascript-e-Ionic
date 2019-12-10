import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private static readonly FOTO_ANDROID: string = "assets/android.png";
  private static readonly FOTO_DESKTOP: string = "assets/desktop.png";
  foto:string;
  dispositivo:string;
  
  constructor(public platform: Platform) {
    
    console.log("Cargando la página tab 3");
    if (platform.is('android')) {
      console.log("Estoy en android");
      window.alert("Estoy en android");
      this.foto = Tab3Page.FOTO_ANDROID;
      this.dispositivo = "android";
    } else if (platform.is('desktop')) {
      console.log("Estoy en escritorio");
      window.alert("Estoy en escritorio");
      this.foto = Tab3Page.FOTO_DESKTOP;
      this.dispositivo = "desktop";
    } else {
      console.log("No sé donde estoy");
      window.alert("No sé donde estoy");
    }
  }

}
