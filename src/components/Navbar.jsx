import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../store';

const Navbar = () => {
  const navigate = useNavigate();
const {UserStore}  =useStores();// Corrected role access
  console.log(UserStore.role);
  const handleLogout = () => {
    UserStore.setRole("");
    navigate("/");
  }
const handleStudentLogout=()=>{
  UserStore.setId("");
  UserStore.setRole("");
  navigate("/");
}
  return (
    <>
      {UserStore.role === "" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/Login', { state: { name: "invigilator" } })}>Invigilator</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/Login', { state: { name: "controller" } })}>Controller of Examination</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/Login', { state: { name: "student" } })}>Candidates</li>
          </ul>
          {/* if user already registered then join now should be shown */}
          {
            UserStore.role === "" && (
              <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                Join Now →
              </button>
            )
          }
          {/* <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Join Now →
          </button> */}
        </nav>
      )}

      {UserStore.role === "invigilator" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/verify')}>Verify Hall Ticket</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={handleLogout}>Logout</li>

          </ul>
          {/* <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Join Now →
          </button> */}
        </nav>
      )}

{UserStore.role === "student" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/generate-hallticket')}>Generate Hall Ticket</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/download')}>Download HallTicket</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={handleStudentLogout}>Logout</li>
          </ul>
          {/* <button onClick={() => navigate('/Register')} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Join Now →
          </button> */}
        </nav>
      )}

      {UserStore.role === "controller" && (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center h-[10%]">
          <div className="text-2xl font-bold text-blue-500">
            Hall Ticket Automation
          </div>
          <ul className="flex space-x-8 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/StudentApprovals')}>Student Approval</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/StudentDetails')}>Student Details</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={()=>navigate('/hallticket-requests')} >Hall Ticket Requests</li>
            <li className="hover:text-blue-500 cursor-pointer" onClick={handleLogout}>Logout</li>

          </ul>
          
        </nav>
      )}


    </>
  );
};

export default Navbar;
