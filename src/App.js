import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Register from './routes/Register';
import Login from './routes/Login';
import userStore from "./store/userStore";
import { Provider } from 'mobx-react';
import StudentApprovals from './routes/StudentApprovals';
import GenerateHallticket from './routes/GenerateHallticket';
import StudentsDetails from './routes/StudentsDetails';
import HallTicketRequests from './routes/HallTicketRequests';
import DownloadHall from './routes/DownloadHall';
import VerifyHallTicket from './routes/VerifyHallTicket';

function App() {
  return (
    <Provider userStore={userStore}>
    <div className="App bg-gray-100">
       <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentApprovals" element={<StudentApprovals/>} />
        <Route path="/generate-hallticket" element={<GenerateHallticket/>} />
        <Route path="/studentDetails" element={<StudentsDetails/>} />
        <Route path="/hallticket-requests" element={<HallTicketRequests/>} />
        <Route path="/download" element={<DownloadHall/>} />
        <Route path="/verify" element={<VerifyHallTicket/>} />
      </Routes>
    </Router>
    </div>
    </Provider>
  );
}

export default App;
