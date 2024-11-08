import { useEffect, useState } from "react";
import { db } from '../recursos/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; // importacion de las herramientas de firebase
import { Trash2, Search } from 'lucide-react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import EmailModal from '../componentes/modalEmail'

export default function ChatbotCRMTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Definido estado para el modal
  const [currentCustomer, setCurrentCustomer] = useState(null);  // Definido estado para el cliente actual

  const formatFirestoreDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersCollection = collection(db, "Cliente");
        const customerSnapshot = await getDocs(customersCollection);
        const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchInteractions = async () => {
      try {
        const interactionsCollection = collection(db, "Cliente"); // Cambia esto según tu colección
        const interactionsSnapshot = await getDocs(interactionsCollection);
        const interactionsList = interactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInteractions(interactionsList);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    fetchCustomers();
    fetchInteractions();
  }, []);

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "Cliente", id));
      setCustomers(customers.filter(customer => customer.id !== id));
      console.log("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Nueva función para eliminar el campo no_pudimos_contestar
  const handleDeleteNoPudimosContestar = async (id) => {
    try {
      const interactionDocRef = doc(db, "Cliente", id);
      await updateDoc(interactionDocRef, {
        no_pudimos_contestar: '' 
      });
      setInteractions(interactions.map(interaction =>
        interaction.id === id ? { ...interaction, no_pudimos_contestar: '' } : interaction
      ));
      console.log("Campo 'no_pudimos_contestar' eliminado correctamente");
    } catch (error) {
      console.error("Error deleting 'no_pudimos_contestar':", error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    Object.values(customer).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredInteractions = interactions.filter(interaction =>
    interaction.no_pudimos_contestar // Filtra solo las interacciones con 'no_pudimos_contestar'
  );

  const handleOpenModal = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Clientes del CRM</h2>
            <div className="mb-4 sm:flex sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Buscar clientes..."
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <h3 className="text-lg font-bold mb-2">Lista de Clientes</h3>
              <table className="min-w-full divide-y divide-gray-300 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Correo Electrónico</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Última Interacción</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Motivo</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{customer.nombre}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatFirestoreDate(customer.ultima_interaccion)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.motivo}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)} 
                            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Eliminar cliente</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No se encontraron clientes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Segunda tabla para interacciones */}
            <div className="mt-4 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <h3 className="text-lg font-bold mb-2">Preguntas sin respuesta</h3>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Correo Electrónico</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">No Pudimos Contestar</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInteractions.length > 0 ? (
                    filteredInteractions.map((interaction) => (
                      <tr key={interaction.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{interaction.nombre}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{interaction.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{interaction.no_pudimos_contestar}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleDeleteNoPudimosContestar(interaction.id)}
                            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                          >
                            Eliminar
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button 
                            onClick={() => handleOpenModal(interaction)} 
                            className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                          >
                            Enviar Correo
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No se encontraron interacciones sin respuesta.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      {isModalOpen && currentCustomer && (
        <EmailModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          customer={currentCustomer}
        />
      )}
    </div>
  );
}
