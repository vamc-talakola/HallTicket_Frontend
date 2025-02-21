import React, { useEffect, useState } from 'react';
import BASE_URL from '../config';

const HallTicketRequests = () => {
  const [loading, setLoading] = useState(false);
  const [hallticketrequests, setHallTicketRequests] = useState([]);
  const reviewerId = localStorage.getItem("id");
  const [modal, setModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [examDates, setExamDates] = useState([]);
  const [examTimes, setExamTimes] = useState([]);
  // const [examDurations, setExamDurations] = useState(["2 Hours", "3 Hours"])

  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  // const [examDuration, setExamDuration] = useState('');
  
  const handleSubmit = () => {
    if (!selectedCity) {
      alert('Please select a city before submitting.');
      return;
    }
    if (!examDate || !examTime) {
      alert('Please select exam date, time before submitting.');
      return;
    }
    handleGenerateHallTicket(selectedCandidate._id,selectedCity)
  };


  useEffect(() => {
    // Generate 3 random future exam dates
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 3; i++) {
        const randomDays = Math.floor(Math.random() * 30) + 1; // Random within next 30 days
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + randomDays);
        dates.push(futureDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      }
      return dates;
    };

    // Define 3 exam times
    const times = ["09:00 AM", "02:00 PM", "05:00 PM"];

    setExamDates(generateDates());
    setExamTimes(times);
  }, []);
  
  // Function to fetch hall ticket requests
  const fetchHallTicketRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/hallticket-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      //filter candidates who have hallticket generated as false
      setHallTicketRequests(data.filter((data)=> !data?.candidateId?.hallTicketGenerated));
    } catch (error) {
      console.error('Error fetching hallticket requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHallTicketRequests();
  }, []);
  console.log(hallticketrequests)

  // Approve or decline action
  const handleAppOrDec = async (candidateId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/approve-hallticket/${candidateId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: status, reviewerId: reviewerId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        // Fetch updated requests
        await fetchHallTicketRequests();
      } else {
        console.error('Failed to update the status of the student');
      }
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const handleGenerateHallTicket = async (candidateId,city) => {
    try {
      console.log(city)
      const response = await fetch(`${BASE_URL}/generate-hallticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ candidateId:candidateId, examCenter:city,
          examDate: examDate, examTime: examTime
         })
      });
      if (response.ok) {
        console.log(`Hall ticket generated for candidate ${candidateId}`);
        alert('Hall ticket generated successfully!');
        setModal(false);
        fetchHallTicketRequests();
      } else {
        console.error('Failed to generate hall ticket');
        alert('Failed to generate hall ticket');
      }
    } catch (error) {
      console.error('Error generating hall ticket:', error);
    }
  };


  const handlePopup = (candidate) => {
    console.log(candidate);
    setSelectedCandidate(candidate); // Set the selected candidate's details
    setModal(true); // Show the modal
  };

  if (loading) {
    return (
      <div className="w-full text-center mt-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  console.log(selectedCity)

  return (
    <div className="container mx-auto my-8 shadow-2xl w-[80%] rounded-lg py-8">
      <h1 className="text-3xl font-bold text-center mb-6">HallTicket Requests</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-center">S.No</th>
            <th className="px-4 py-2 text-center">candidateId</th>
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">category</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">payment Status</th>

            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hallticketrequests.length > 0 ? (
            hallticketrequests.map((student, index) => (
              <tr key={student._id} className="border-b">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center">{student?._id}</td>
                <td className="px-4 py-2 text-center">{student?.candidateId?.name}</td>
                <td className="px-4 py-2 text-center">{student?.candidateId?.category}</td>
                <td className="px-4 py-2 text-center">{student?.status}</td>
                <td className="px-4 py-2 text-center">{student?.paymentStatus ? "Paid" : "Not paid"}</td>
                <td className="px-4 py-2 text-center">
                  {student.status === "approved" ? (
                    <button
                      onClick={() => handlePopup(student?.candidateId)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                      Generate Hall Ticket
                    </button>
                  ) : (
                    <> 
                      <button
                        onClick={() => handleAppOrDec(student?._id, "approved")}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 mb-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAppOrDec(student?._id, "rejected")}
                        className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No hallticket requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modal && selectedCandidate && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Candidate Details</h2>
      
      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {selectedCandidate?.name}</p>
        <p><strong>Father's Name:</strong> {selectedCandidate?.fatherName}</p>
        <p><strong>Mother's Name:</strong> {selectedCandidate?.motherName}</p>
        <p><strong>DOB:</strong> {new Date(selectedCandidate?.dob).toLocaleDateString()}</p>
      </div>
      
      <div className="mt-4">
        <p className="font-medium">Exam Preferences:</p>
        <ul className="list-none ml-4 space-y-2">
          {selectedCandidate?.examPreferences?.cities.map((city, index) => (
            <li key={index} className="flex items-center">
              <input
                type="radio"
                name="examCity"
                required
                value={city}
                checked={selectedCity === city}
                onChange={() => setSelectedCity(city)}
                className="mr-2"
              />
              {city}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="block font-medium">Exam Date</label>
          <select
            value={examDate}
            required
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="">Select Exam Date</option>
            {examDates.map((date, index) => (
              <option key={index} value={date}>{date}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block font-medium">Exam Time</label>
          <select
            required
            value={examTime}
            onChange={(e) => setExamTime(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="">Select Exam Time</option>
            {examTimes.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>
        
        {/* <div>
          <label className="block font-medium">Exam Duration</label>
          <select
            required
            value={examDuration}
            onChange={(e) => setExamDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          >
            <option value="">Select Exam Duration</option>
            {examDurations.map((duration, index) => (
              <option key={index} value={duration}>{duration}</option>
            ))}
          </select>
        </div> */}
      </div>
      
      <div className="flex justify-end mt-6 space-x-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={handleSubmit}
        >
          Generate Hall Ticket
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => setModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
) }
    </div>
  );
};

export default HallTicketRequests;

