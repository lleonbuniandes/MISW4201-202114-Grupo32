import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Album } from '../album';
import { AlbumService } from '../album.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioSimple } from 'src/app/usuario/usuario';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {

  @Input() album: Album;
  @Output() deleteAlbum = new EventEmitter();

  userId: number;
  compartirAlbumform: FormGroup;
  token: string;
  userList: Array<UsuarioSimple>;
  usuariosACompartir: Array<number>

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private albumService: AlbumService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
  }

  goToEdit(){
    this.routerPath.navigate([`/albumes/edit/${this.album.id}/${this.userId}/${this.token}`])
  }

  goToJoinCancion(){
    this.routerPath.navigate([`/albumes/join/${this.album.id}/${this.userId}/${this.token}`])
  }

  eliminarAlbum(){
    this.deleteAlbum.emit(this.album.id)
  }

  compartirAlbum(){
    this.usuarioService.getUsuarios(this.token).subscribe(usuarios => {
      this.userList = usuarios.filter( user => {
        return user.id != this.album.usuario && this.album.compartido_a.indexOf(user.id) == -1;
      })
    })
    this.usuariosACompartir = []
  }

  onSubmitCompartirAlbum(){
    if (this.usuariosACompartir.length > 0)
    {
      this.albumService.compartirAlbum(this.token, this.album, this.usuariosACompartir).subscribe(album => {
        album.usuario = this.album.usuario;
        this.album = album;
        console.log(album);
        this.albumCompartidoExitosamente()
      }, error => {
        this.showError("Hubo un error. ->" + error.message)
      })
    }else{
      this.showError("Debe seleccionar al menos un usuario para compartir.")
    }
  }

  onCheckboxChange(event: any){
    if (event.target.checked){
      this.usuariosACompartir.push(parseInt(event.target.value));
    }else{
      let value = parseInt(event.target.value);
      this.usuariosACompartir = this.usuariosACompartir.filter( userId => userId != value);
    }
    console.log(this.usuariosACompartir)
  }

  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  albumCompartidoExitosamente() {
    this.toastr.success(`El album "${this.album.titulo}" fue compartido.`, "Actualización exitosa");
  }

}
