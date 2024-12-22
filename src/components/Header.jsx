import React from 'react';

const Header = () => { 
  return (
    <div className="relative bg-cover bg-center h-[90%] flex items-center justify-center" style={{ backgroundImage: `url('https://via.placeholder.com/1920x1080')` }}>
      <div className="absolute inset-0 bg-black opacity-40 "></div>
      <div className="text-center text-white z-10 px-4">
        <h2 className="text-blue-400 uppercase font-semibold mb-4">Management</h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Hall Ticket Automation with Integrated QR Codes</h1>
        <p className="text-gray-300 mb-6">
          Simplifying hall ticket management with advanced QR technology.
        </p>
      </div>
    </div>
  );
};

export default Header;
