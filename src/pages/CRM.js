import { useEffect, useState } from "react";
import { db } from '../recursos/firebase';
import { collection, getDocs } from "firebase/firestore";
import { Trash2 } from 'react-feather';
import Footer from '../componentes/footer';

export default function ChatbotCRMTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  const formatFirestoreDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(); // Formato legible
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

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    Object.values(customer).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDeleteCustomer = (id) => {
    console.log("Delete customer", id);
  };

  return (
    <div className="min-h-full">
      <main>
        <div className="pt-8 pb-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Clientes del CRM</h1>
            <div className="mt-6 flex items-center justify-between">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-3 pr-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Buscar clientes..."
              />
            </div>

            <div className="mt-8 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Correo Electrónico</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Última Interacción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Motivo</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{customer.nombre}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{customer.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{formatFirestoreDate(customer.ultima_interaccion)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{customer.motivo}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-900 ml-2">
                          <Trash2 className="inline h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
