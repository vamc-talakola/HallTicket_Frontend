import React from 'react';
import { useNavigate } from 'react-router-dom';
import userStore from '../store/userStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { role } = userStore;  // Corrected role access
  console.log(role);
  const handleLogout = () => {
    userStore.setRole("");
    navigate("/");
  }
const handleStudentLogout=()=>{
  userStore.setId("");
  userStore.setRole("");
  navigate("/");
}
  return (
    <>
      {role === "" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/Login', { state: { name: "invigilator" } })}>Invigilator</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/Login', { state: { name: "controller" } })}>Controller of Examination</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/Login', { state: { name: "student" } })}>Students</li>
          </ul>
          <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Join Now →
          </button>
        </nav>
      )}

      {role === "invigilator" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" >Verify Hall Ticket</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={handleLogout}>Logout</li>

          </ul>
          <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Join Now →
          </button>
        </nav>
      )}

{role === "student" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/generate-hallticket')}>Generate Hall Ticket</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={handleStudentLogout}>Logout</li>

          </ul>
          <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Join Now →
          </button>
        </nav>
      )}

      {role === "controller" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/StudentApprovals')}>Student Approval</li>
            <li className="hover:text-blue-500 cursor-pointer">Student Details</li>
            <li className="hover:text-blue-500 cursor-pointer" >Hall Ticket Requests</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={handleLogout}>Logout</li>

          </ul>
          
        </nav>
      )}


    </>
  );
};

export default Navbar;
