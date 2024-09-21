import React, { useState } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { XMarkIcon } from '@heroicons/react/24/outline';




const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el chatbot está abierto

  const toggleChat = () => {
    setIsOpen(!isOpen); // Alterna entre abrir y cerrar el chat
  };

  return (
    <>
      {}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        data-state="closed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white block border-gray-200 align-middle"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200" />
        </svg>
      </button>

      {/* Ventana del chatbot (solo visible cuando isOpen es true) */}
      {isOpen && (
        <div
          style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
          className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[340px] h-[480px]" // Ajusté el tamaño a w-[340px] y h-[480px]
        >
          {/* Heading con botón de cerrar */}
          <div className="flex justify-between items-center pb-6">
            <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
            <button onClick={toggleChat}>
              <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Contenedor del chat */}
          <div className="pr-4 h-[350px] overflow-y-auto" style={{ minWidth: '100%', display: 'table' }}>
            {/* Mensaje del AI */}
            <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  <FaRobot className="text-black" size={20} />
                </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">AI </span>
                Hi, how can I help you today?
              </p>
            </div>

            {/* Mensaje del usuario */}
            <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  <FaUser className="text-black" size={20} />
                </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">You </span>
                fewafef
              </p>
            </div>

            {/* Otro mensaje del AI */}
            <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  <FaRobot className="text-black" size={20} />
                </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">AI </span>
                Sorry, I couldn't find any information in the documentation about that. Expect answer to be less accurate. I couldn't find the answer to this in the verified sources.
              </p>
            </div>
          </div>

          {/* Caja de entrada de mensajes */}
          <div className="flex items-center pt-0">
            <form className="flex items-center justify-center w-full space-x-2">
              <input
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                value=""
              />
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;