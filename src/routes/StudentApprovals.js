import React, { useEffect, useState } from 'react'
import BASE_URL from '../config'

const StudentApprovals = () => {
    const [approvalStudents, setApprovalStudents] = useState([])
    useEffect(() => {
        const getCandidates = async () => {
          try {
            const response = await fetch(`${BASE_URL}/candidates`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            if (!response.ok) {
              // Handle error if the response is not ok
              throw new Error('Failed to fetch candidates');
            }
      
            const data = await response.json();
      
            // Ensure data exists and is an array before applying filter
            if (data?.data) {
              const filteredStudents = data?.data.filter(
                (student) => !student.hasOwnProperty('status')
              );
              setApprovalStudents(filteredStudents);
            } else {
              console.error('Received invalid data format', data);
            }
          } catch (error) {
            console.error('Error fetching candidates:', error);
          }
        };
      
        getCandidates();
      }, []);

      console.log(approvalStudents)

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-6">Approval Students List</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">Category</th>
            <th className="px-4 py-2 text-center">Mobile Number</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Date of Birth</th>
            <th className="px-4 py-2 text-center">Father Name</th>
            <th className="px-4 py-2 text-center">Mother Name</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvalStudents.map((student) => (
            <tr key={student._id} className="border-b">
              <td className="px-4 py-2 text-center">{student.name}</td>
              <td className="px-4 py-2 text-center">{student.category}</td>
              <td className="px-4 py-2 text-center">{student.contactInfo.mobileNumber}</td>
              <td className="px-4 py-2 text-center">{student.contactInfo.email}</td>
              <td className="px-4 py-2 text-center">{new Date(student.dob).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-center">{student.fatherName}</td>
              <td className="px-4 py-2 text-center">{student.motherName}</td>
              <td className="px-4 py-2 text-center">
                <button
                //   onClick={() => handleApprove(student._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 mr-2"
                >
                  Approve
                </button>
                <button
                //   onClick={() => handleDecline(student._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentApprovals
