import React, { useState } from "react";
import axios from "axios";

const EmailModal = ({ customer, onClose }) => {
  const [contact, setContact] = useState({
    name: customer ? customer.nombre : "",
    email: customer ? customer.email : "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false); // Para deshabilitar el botón mientras se envía el correo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contact.message.trim()) {
      alert("El mensaje no puede estar vacío.");
      return;
    }

    const emailData = {
      to: customer.email, // Correo del destinatario
      subject: `Mensaje de ${contact.name}`, // Asunto
      body: contact.message, // Cuerpo del mensaje
    };

    setIsSending(true); // Deshabilitar el botón de envío

    try {
      const response = await axios.post(
        "https://us-central1-chatbot-d9174.cloudfunctions.net/sendEmail",
        emailData
      );
      console.log("Correo enviado:", response.data);
      alert("Correo enviado con éxito"); // Mensaje de éxito
      onClose(); // Cerrar el modal después de enviar el correo
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Error: " + (error.response ? error.response.data.message : error.message)); // Mostrar error
    } finally {
      setIsSending(false); // Volver a habilitar el botón
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Enviar Correo a {customer.nombre}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              name="name"
              value={contact.name}
              onChange={handleChange}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Correo:</label>
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mensaje:</label>
            <textarea
              name="message"
              value={contact.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isSending} // Deshabilitar mientras se envía el correo
              className={`px-4 py-2 ${isSending ? "bg-gray-500" : "bg-blue-600"} text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {isSending ? "Enviando..." : "Enviar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
