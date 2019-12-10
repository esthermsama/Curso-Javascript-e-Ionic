import { Component } from '@angular/core';
import { Imc } from '../imc';
import { TIMC } from '../timc.enum';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private imc: Imc;
  private static readonly FOTO_DELGADO: string = "assets/delgado.jpg";
  private static readonly FOTO_DESNUTRIDO: string = "assets/desnutrido.jpg";
  private static readonly FOTO_IDEAL: string = "assets/ideal.jpg";
  private static readonly FOTO_SOBREPESO: string = "assets/sobrepeso.jpg";
  private static readonly FOTO_OBESO: string = "assets/obeso.png";
  private arrayImc: Array<Imc>;  //declaro el array

  constructor() {
    this.imc = new Imc();
    this.arrayImc = new Array<Imc>(); //creo la lista
  }

  ngOnInit() {
  }

  private obtenerImagen(tipoIMC: TIMC): string {
    let ruta_foto: string;

    switch (tipoIMC) {
      case TIMC.DELGADO: ruta_foto = Tab2Page.FOTO_DELGADO; break;
      case TIMC.DESNUTRIDO: ruta_foto = Tab2Page.FOTO_DESNUTRIDO; break;
      case TIMC.IDEAL: ruta_foto = Tab2Page.FOTO_IDEAL; break;
      case TIMC.SOBREPESO: ruta_foto = Tab2Page.FOTO_SOBREPESO; break;
      case TIMC.OBESO: ruta_foto = Tab2Page.FOTO_OBESO; break;
    }

    return ruta_foto;
  }
  private obtenerIMCNominal(numimc: number): TIMC {
    let tipoIMC: TIMC;

    if (numimc < 16) {
      tipoIMC = TIMC.DESNUTRIDO;
    } else if (numimc >= 16 && numimc < 18) {
      tipoIMC = TIMC.DELGADO;
    } else if (numimc >= 18 && numimc < 25) {
      tipoIMC = TIMC.IDEAL;
    } else if (numimc >= 25 && numimc < 31) {
      tipoIMC = TIMC.SOBREPESO;
    } else {
      tipoIMC = TIMC.OBESO;
    }

    return tipoIMC;
  }
  calcularIMC() {
    let valornumimc = this.imc.peso / (this.imc.altura * this.imc.altura);
    this.imc.nominal = this.obtenerIMCNominal(valornumimc);
    this.imc.foto = this.obtenerImagen(this.imc.nominal);
    console.log(this.imc.nominal);
    console.log(this.imc.foto);
    // Creo el nuevo elemento del array
    let imcAux = new Imc();
    imcAux.nominal = this.imc.nominal;
    imcAux.peso = this.imc.peso;
    imcAux.altura = this.imc.altura;
    imcAux.foto = this.imc.foto;
    // Introducirlo
    this.arrayImc.push(imcAux);
    console.log(`El array es ${this.arrayImc}`);
  }
  mostrarArray() {
    for (let oimc of this.arrayImc) {
      console.log(`altura ${oimc.altura}`);
      console.log(`peso ${oimc.peso}`);
      console.log(`imc ${oimc.nominal}`);
      console.log(`foto ${oimc.foto}`);
      console.log("-------------"); //separador
    }
  }
  borrar(){
    this.arrayImc.length = 0;
  }
  ordenarPeso(){
    console.log("ordenar por pero ... ");
    this.arrayImc.sort((a,b) => (a.peso - b.peso)
    );
  }
  ordenarAltura(){
    console.log("ordenar por altura ... ");
    this.arrayImc.sort((a,b)=>(a.altura - b.altura)
    );
  }
}
