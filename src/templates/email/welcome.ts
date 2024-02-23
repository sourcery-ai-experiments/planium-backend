export const welcomeTemplate = (
  name: string,
  username: string,
  password: string,
) => {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bienvenida</title>
  
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f0f0f0;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 40px auto;
        }
        h1 {
          color: #333;
        }
        .credentials {
          background-color: #f9f9f9;
          border-left: 4px solid #007bff;
          padding: 10px;
          margin-top: 20px;
        }
        .credentials h2 {
          margin-top: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bienvenido/a! ${name}</h1>
        <p>Estamos emocionados de tenerte con nosotros. Aquí están tus credenciales de acceso:</p>
        <div class="credentials">
          <h2>Credenciales de Acceso</h2>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>Por favor, asegúrate de cambiar tu contraseña la primera vez que inicies sesión por motivos de seguridad.</p>
      </div>
    </body>
  </html>  
    `;
};
