import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private static readonly SECUENCIA_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
  private num:number;
  private letra:string ;

  constructor() {
    this.letra = '...';
  }


  calcularLetra(){
    var resto = this.num % HomePage.SECUENCIA_DNI.length;
    this.letra = HomePage.SECUENCIA_DNI.charAt(resto);
 
  }
}
