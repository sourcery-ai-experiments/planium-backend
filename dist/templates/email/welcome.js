"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeTemplate = void 0;
const welcomeTemplate = (name, username, password) => {
    return `
  <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenida a Planium</title>
    <style>
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .content {
        margin-top: 20px;
        border-top: 2px solid #eee;
        padding-top: 20px;
      }

      .important {
        color: #007bff;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 0.9em;
        color: #666;
      }
      .steps {
        background-color: #f9f9f9;
        padding: 15px;
        border-left: 4px solid #007bff;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>¡Hola, ${name}!</h2>
      <p>¡Nos complace darte la bienvenida a la familia de <strong>Planium</strong>!</p>
      <p>Estamos encantados de tenerte a bordo y emocionados por lo que vamos a lograr juntos.</p>
      <div class="content">
        <h3>Tus credenciales de acceso temporal son:</h3>
        <p>Nombre de Usuario: <span class="important">${username}</span></p>
        <p>Contraseña Temporal: <span class="important">${password}</span> (recuerda cambiarla pronto)</p>
        <div class="steps">
          <h4>Próximos pasos importantes:</h4>
          <p>
            1. Activa tu cuenta:
            <a href="#" onclick="alert(':D');">Haz clic aquí</a>
            para iniciar sesión y activar tu cuenta.
          </p>
          <p>
            2. Crea tu contraseña: Sigue las instrucciones en pantalla para establecer una contraseña nueva y segura.
          </p>
          <p>3. ¡Listo!: Explora todas las herramientas y recursos que tenemos disponibles para ti.</p>
        </div>
        <p>
          Por seguridad, recuerda cambiar tu contraseña temporal durante tu primer inicio de sesión. Si tienes alguna
          duda o necesitas asistencia, no dudes en contactarnos en [correo de soporte].
        </p>
        <p>¡Estamos aquí para apoyarte en cada paso!</p>
      </div>
      <p class="footer">Bienvenido a bordo,<br />El Equipo de Planium</p>
    </div>
  </body>
</html>

  `;
};
exports.welcomeTemplate = welcomeTemplate;
//# sourceMappingURL=welcome.js.map