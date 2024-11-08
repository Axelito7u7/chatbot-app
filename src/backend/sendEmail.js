// sendEmail.js
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { toEmail, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // O usa el servicio que prefieras (Gmail, Outlook, etc.)
      auth: {
        user: "tu_correo@gmail.com", // Tu correo autorizado
        pass: "tu_contraseña",       // Tu contraseña o app password
      },
    });

    let mailOptions = {
      from: "tu_correo@gmail.com",
      to: toEmail,
      subject: "Mensaje de Maestrías en negocios",
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de correo escuchando en el puerto ${PORT}`);
});
