import React from 'react';
import homeImage from '../assets/home.webp'

const Header = () => { 
  return (
    <div className="relative bg-cover bg-center h-[120%] flex items-center justify-center overflow-y-hidden" style={{ backgroundImage: `url(${homeImage})` }}>
      <div className="absolute inset-0 bg-black opacity-40 "></div>
      <div className="text-center text-white z-10 px-4">
       
      </div>
    </div>
  );
};

export default Header;
