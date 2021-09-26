from flaskr.vistas.vistas import VistaCompartirAlbum, VistaCompartirCancion
from flaskr import create_app
from flask_restful import Api
from .modelos import db
from .vistas import VistaCanciones, VistaCancion, VistaSignIn, VistaAlbum, VistaAlbumsUsuario, VistaCancionesAlbum, VistaLogIn, VistaAlbumesCanciones, VistaUsuarios, VistaAlbumsCompartidosUsuario, VistaCancionesCompartidosUsuario, VistaComentarAlbum
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin

app = create_app('default')
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()
cors = CORS(app)

api = Api(app)
api.add_resource(VistaCanciones, '/canciones/usuario/<int:id_usuario>')
api.add_resource(VistaCancion, '/cancion/<int:id_cancion>')
api.add_resource(VistaAlbumesCanciones, '/cancion/<int:id_cancion>/albumes')
api.add_resource(VistaSignIn, '/signin')
api.add_resource(VistaLogIn, '/logIn')
api.add_resource(VistaAlbumsUsuario, '/usuario/<int:id_usuario>/albumes') # crear obtener album
api.add_resource(VistaAlbum, '/album/<int:id_album>')
api.add_resource(VistaUsuarios, '/usuarios')
api.add_resource(VistaCompartirAlbum, '/compartir/album/<int:id_album>')
api.add_resource(VistaAlbumsCompartidosUsuario, '/usuario/<int:id_usuario>/albumes_compartidos')
api.add_resource(VistaCompartirCancion, '/compartir/cancion/<int:id_cancion>')
api.add_resource(VistaCancionesAlbum, '/album/<int:id_album>/canciones')
api.add_resource(VistaComentarAlbum, '/album/<int:id_album>/comentario')
api.add_resource(VistaCancionesCompartidosUsuario, '/usuario/<int:id_usuario>/canciones_compartidas')

jwt = JWTManager(app)