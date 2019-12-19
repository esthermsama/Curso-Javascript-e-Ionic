import { Component, OnInit } from '@angular/core';
import { RemoteApiService } from '../remoteapi.service';
import { Peli } from '../listapelis/peli';
import { Constantes } from '../constantes';
import { LoadingController, AlertController, ToastController, IonItemSliding, IonTextarea, PopoverController, NavController, Platform } from '@ionic/angular';
import { Login } from '../login/login';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Comentario } from './comentario';
import { NuevoComentarioRequest } from './nuevo-comentario-request';
import { NuevoComentarioResponse } from './nuevo-comentario-response';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
  providers: [RemoteApiService]
})
export class ComentariosPage implements OnInit {

  peli:Peli;
  login:Login;
  esperando:boolean;
  elementoEspera: HTMLIonLoadingElement;
  lista_comentarios: Array<Comentario>;
  lista_comentariosResponse : Array<NuevoComentarioResponse>;
  enedicion:boolean;
  nuevaopinion:string;
  autoload:boolean;
  idalarma:number;

  constructor(public platform:Platform, public servicio_remoto:RemoteApiService, public lc:LoadingController, public ac:AlertController, public tc:ToastController, public nc:NavController) { 

    let peli_json:string =  window.sessionStorage.getItem(Constantes.CLAVE_PELIS);
    this.peli = JSON.parse(peli_json);
    console.log ("cargando comentarios de ..." + peli_json);

    let crendeciales:string =  window.localStorage.getItem(Constantes.CLAVE_CREDENCIALES);
    this.login = JSON.parse(crendeciales);
    console.log ("crendeciales ..." + crendeciales);

    this.enedicion = false;
    this.autoload = false;
  }


  ngOnInit() {
    console.log ("obteniendo comentarios ...");
    this.mostrarEspera("Obteniendo comentarios");
    this.servicio_remoto.getComentariosPeli(this.login.token, this.peli.idfoto).subscribe(
      resp_ok => {
        let respuesta_http : HttpResponse<Array<Comentario>> = resp_ok as  HttpResponse<Array<Comentario>>;
        if (respuesta_http.status==200)
        {
          this.lista_comentarios = respuesta_http.body;
          this.lista_comentarios.map(comentario => console.log (comentario.texto + " " +comentario.id + " " +comentario.autor + " " +comentario.momento));
        } else if (respuesta_http.status==204)
        {
          console.log ("Pelicula sin comentarios");
          this.informarPeliSinComentarios();
        }
        this.ocultarEspera();
      }, resp_ko => {
        console.log ("Error al recuperar la lista de comentarios");
        //this.informarErrorComentarios(<HttpErrorResponse>resp_ko);
        this.ocultarEspera();
      }
    );
  }

  actualizarauto(){
    if(this.autoload){
      //this.idalarma = window.setInterval(this.refrescaComentarios,3000);
      this.idalarma = window.setInterval(()=>{this.refrescaComentarios();},3000);
    }else{
      window.clearInterval(this.idalarma);
    }
    console.log("actualizar auto = "+this.autoload);
    
  }

  saludo(){
    console.log("hola Romero el madero");
  }

public async ocultarEspera():Promise<void> {
    console.log("ocultandoEspera  ...");
    this.esperando = false;
    //SI LA COSA TARDA BASTANTE, SE HACE DISMISS DESDE AQUÍ SE HA PRESENTADO
    if (this.elementoEspera)
    {
      console.log("La tx termina después de mostrarse el elemento ");
      await this.elementoEspera.dismiss();
  } else {
    console.log("El elemento espera NO existe");
  }
  
}

public async mostrarEspera(mensaje:string):Promise<void> {
  this.esperando = true;
  console.log("Mostrando espera ...");
  this.elementoEspera = await this.lc.create({
    message: mensaje
  });
  console.log("elemento espera creado ...");
  await this.elementoEspera.present();
  console.log("elemento espera presentado ...");
  if (!this.esperando)
  {
    //SI LA COSA TARDA MUY POCO, CUANDO SE HA PRESENTADO YA HA ACABADO
    //CUANDO EL ELMENTO TERMINA DE PRESENTARSE, YA HA ACABADO :)
    console.log("esperando == false la tx ha terminado antes de mostrarse el elemento");
    await this.elementoEspera.dismiss();
  }

}
ionViewDidEnter(){
  console.log("Entro en el ionViewDidEnter de comentarios page");
}



async informarPeliSinComentarios(){
  const toast = await this.tc.create({
    message: 'Peliculas sin comentarios',
    duration: 2000,
    position:'middle'
  });
  toast.present();
}

addComentario(){
  console.log("Toco el fab de add comentario");
  this.enedicion=true;
}
public publicarNuevoComentario()
  {
    this.enedicion=false;
    console.log ("Nueva opi " + this.nuevaopinion);
    let nuevo_comentario: NuevoComentarioRequest = new NuevoComentarioRequest();
    nuevo_comentario.nombre = this.login.nombre;
    nuevo_comentario.token = this.login.token;
    nuevo_comentario.idfoto = this.peli.idfoto;
    nuevo_comentario.texto = this.nuevaopinion
    this.mostrarEspera("Publicando comentario . . .");
    this.servicio_remoto.postComentarioPeli(nuevo_comentario).subscribe (
      resp_ok => {
        let respuesta_http : HttpResponse<void> = <HttpResponse<void>>resp_ok;
        switch (respuesta_http.status)
        {
          case 403: 
          case 400:  this.informarErrorInsertarComentario();
          break;
          case 201:  this.refrescaComentarios();//tb podemos informarl y despues de que cierre actualizar//this.informarComentarioBorrado();
          break;
        }
        this.nuevaopinion='';
        this.ocultarEspera();
      },
      resp_ko => { this.informarErrorInsertarComentario();this.nuevaopinion='';this.ocultarEspera();}
    )

  }


  public async informarErrorInsertarComentario ():Promise<void>
  {

    let alert : HTMLIonAlertElement = await this.ac.create({
      header: 'Error al publicar el comentario',
      message: 'Revise sus permisos o inténtelo más tarde',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('se cierra el diálogo');
          }
        }
      ]
    });

     await alert.present();
  }

    
  refrescaComentarios(event?) {
    console.log('Empieza el refresco de comentarios');
  
    this.servicio_remoto.getComentariosPeli(this.login.token, this.peli.idfoto)
      .subscribe( 
        resp_ok => {  
          let respuesta_http : HttpResponse<Array<Comentario>> = resp_ok as  HttpResponse<Array<Comentario>>;
          if (respuesta_http.status==200)
          {
            this.lista_comentarios = respuesta_http.body;
            this.lista_comentarios.map(comentario => console.log (comentario.texto + " " +comentario.id + " " +comentario.autor));
          } else if (respuesta_http.status==204)
          {
            console.log ("Pelicula sin comentarios");
            this.lista_comentarios=null;
            this.informarPeliSinComentarios();
          }
          if(event!=null){
            event.target.complete();
          }
          
        }, resp_ko => {
          console.log ("Error al recuperar la lista de comentarios");
          this.informarErrorComentarios(<HttpErrorResponse>resp_ko);
          if(event!=null){
            event.target.complete();
          }
        });
  
  } 
  

public async informarErrorComentarios (error:HttpErrorResponse):Promise<void>
  {

    let alert : HTMLIonAlertElement = await this.ac.create({
      header: error.statusText + " " + error.status,
      message: '¡Faltan comentarios! Inténtelo de nuevo',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('se cierra el diálogo');
          }
        }
      ]
    });

     await alert.present();
  }

cancelarNuevoComentario(){
  this.enedicion=false;
  this.nuevaopinion = "";
}

chipTocada(){

}

borrar(comentario:Comentario,elementoDeslizante:IonItemSliding){
  console.log("quiere borrar el comentario "+ comentario.id);
  this.pedirConfirmacion(comentario,elementoDeslizante);
 
}

public async pedirConfirmacion (comentario:Comentario,elementoDeslizante:IonItemSliding):Promise<void>
  {
    let alert : HTMLIonAlertElement = await this.ac.create({
      header: "MENSAJE DE CONFIRMACIÓN",
      message: '¿Confirma eliminar comentario #' + comentario.id + '?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            console.log('se cierra el diálogo');
            this.borrarConfirmado (comentario);
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('se cierra el elemtno');
            elementoDeslizante.close();
          }
        }
      ]
    });

     await alert.present();
    
  }

  public async informarErrorBorrarComentarios ():Promise<void>
  {

    let alert : HTMLIonAlertElement = await this.ac.create({
      header: 'Error al borrar el comentario',
      message: 'Revise sus permisos o inténtelo más tarde',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('se cierra el diálogo');
          }
        }
      ]
    });

     await alert.present();
  }
  borrarConfirmado (comentario:Comentario)
  {

    console.log ("confirma que quiere borrar el comentario");
    this.servicio_remoto.deleteComentarioPeli(this.login.token, comentario.id, comentario.autor).subscribe(
      resp_ok => {
        let respuesta_http : HttpResponse<void> = <HttpResponse<void>>resp_ok;
        switch (respuesta_http.status)
        {
          case 403: 
          case 400:  this.informarErrorBorrarComentarios();
          break;
          case 200:  this.refrescaComentarios();//this.informarComentarioBorrado();
          break;
        }
      },
      resp_ko => { this.informarErrorBorrarComentarios();}
    )

  }
  getFechaHora(fechahora:number):string{
    let momento_calculado:string = "";

    momento_calculado = new Date(fechahora).toISOString();

    return momento_calculado;
  }
}