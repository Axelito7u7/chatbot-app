// footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-xl font-bold text-white">Company Name</h2>
            <p className="mt-2 text-gray-400">
              1234 Street Address, City, State, 12345
            </p>
          </div>
          <div className="mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-white">Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Contact</a>
              </li>
            </ul>
          </div>
          <div className="mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 00-6 6 6 6 0 006 6 6 6 0 000-12zM6 12a6 6 0 016-6 6 6 0 00-6 6zm0 0a6 6 0 0012 0 6 6 0 00-6 6z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8.59A4.992 4.992 0 0119 12c0 2.21-1.79 4-4 4-1.5 0-2.82-.5-3.9-1.35A4.992 4.992 0 0112 19c2.21 0 4-1.79 4-4 0-1.5-.5-2.82-1.35-3.9A4.992 4.992 0 0117 8.59z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.5 3.5a2 2 0 00-2 2v15a2 2 0 002 2h13a2 2 0 002-2V5.5a2 2 0 00-2-2H5.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-400">© 2024 Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
