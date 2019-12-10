import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

 
  private static readonly SECUENCIA_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
  private num:number;
  private letra:string ;

  constructor() {
    this.letra = '...';
  }


  calcularLetra(){
    var resto = this.num % Tab1Page.SECUENCIA_DNI.length;
    this.letra = Tab1Page.SECUENCIA_DNI.charAt(resto);
 
  }
}