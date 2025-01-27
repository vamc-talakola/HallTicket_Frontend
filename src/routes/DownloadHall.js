// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import html2canvas from 'html2canvas';
// import BASE_URL from '../config';
// import { jsPDF } from 'jspdf';

// const DownloadHall = () => {
//   const [hallTicketNumber, setHallTicketNumber] = useState('');
//   const [hallTicketDetails, setHallTicketDetails] = useState(null);
//   const [candidateDetails, setCandidateDetails] = useState({});
//   const printRef = useRef();
//   const [proxiedPhotoUrl, setProxiedPhotoUrl] = useState('');
//   const [proxiedSignatureUrl, setProxiedSignatureUrl] = useState('');
 


//   useEffect(() => {
//     const savedHallTicketDetails = localStorage.getItem('hallTicketDetails');
//     const savedCandidateDetails = localStorage.getItem('candidateDetails');

//     if (savedHallTicketDetails) {
//       setHallTicketDetails(JSON.parse(savedHallTicketDetails));
//     }
//     if (savedCandidateDetails) {
//       setCandidateDetails(JSON.parse(savedCandidateDetails));
//     }
    
//   }, []);

//   const fetchProxiedImage = async (url, setImageUrl) => {
//     if (!url) {
//       console.error("No image URL provided");
//       return;
//     }
    
//     try {
//       const response = await fetch(
//         `${BASE_URL}/proxy?url=${encodeURIComponent(url)}`
//       );
//       const data = await response.json();
//       console.log(data);
//       const proxiedImageUrl = `${BASE_URL}${data.url}`;
//       console.log(proxiedImageUrl);
//       setImageUrl(proxiedImageUrl);
//       console.log("Proxied image URL:", proxiedImageUrl);
//         } catch (error) {
//       console.error('Error fetching proxied image:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(`${BASE_URL}/hallticket/${hallTicketNumber}`);
//       const hallTicketData = response.data.hallTicket;
//       setHallTicketDetails(hallTicketData);

//       const candidateResponse = await axios.get(`${BASE_URL}/candidate/${hallTicketData.candidateId}`);
//       const candidateData = candidateResponse.data;
//       setCandidateDetails(candidateData);

//       fetchProxiedImage(candidateResponse.data.photo, setProxiedPhotoUrl);
//       fetchProxiedImage(candidateResponse.data.signature, setProxiedSignatureUrl);

//       // localStorage.setItem('hallTicketDetails', JSON.stringify(hallTicketData));
//       // localStorage.setItem('candidateDetails', JSON.stringify(candidateData));
//     } catch (error) {
//       console.error('Error fetching hall ticket details:', error);
//     }
//   };

//   const handlePrint = async () => {
//     const preloadImage = (src) => {
//       return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.crossOrigin = 'anonymous'; // Ensure images load properly for CORS
//         img.src = src;
//         img.onload = () => resolve(true);
//         img.onerror = (err) => {
//           console.error("Error loading image:", src, err);
//           reject(err);
//         };
//       });
//     };
  
//     try {
//       console.log("Photo URL:", proxiedPhotoUrl);
//       console.log("Signature URL:", proxiedSignatureUrl);
  
//       // Preload both the photo and signature
//       await Promise.all([
//         proxiedPhotoUrl ? preloadImage(proxiedPhotoUrl).catch(() => console.warn("Photo failed to load")) : Promise.resolve(),
//         proxiedSignatureUrl ? preloadImage(proxiedSignatureUrl).catch(() => console.warn("Signature failed to load")) : Promise.resolve(),
//       ]);
  
//       // Generate the PDF after images are loaded
//       const canvas = await html2canvas(printRef.current, {
//         scale: 2, // Higher quality
//         useCORS: true, // Allow cross-origin images
//         allowTaint: true, // Allow rendering tainted images
//       });
  
//       const dataURL = canvas.toDataURL('image/jpeg', 1.0);
//       const doc = new jsPDF();
//       doc.addImage(dataURL, 'JPEG', 10, 10, 190, 270); // Adjust dimensions as needed
//       doc.save(`${hallTicketDetails.hallTicketNumber}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     }
//   };
  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       {!hallTicketDetails && (
//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-80">
//           <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Generate Hall Ticket</h2>
//           <div className="mb-4">
//             <label htmlFor="hallTicketNumber" className="block text-sm font-medium text-gray-600">
//               Hall Ticket Number:
//             </label>
//             <input
//               type="text"
//               id="hallTicketNumber"
//               value={hallTicketNumber}
//               onChange={(e) => setHallTicketNumber(e.target.value)}
//               className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter Hall Ticket Number"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//           >
//             Submit
//           </button>
//         </form>
//       )}

//       {hallTicketDetails && (
//         <div ref={printRef} className="mt-6 bg-white p-6 rounded-lg shadow-lg">
//           <h3 className="text-xl font-bold mb-4 text-gray-700 text-center">Hall Ticket Details</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <p><strong>Hall Ticket:</strong> {hallTicketDetails.hallTicketNumber}</p>
//             <p><strong>Exam Center:</strong> {hallTicketDetails.examCenter}</p>
//             <p><strong>Candidate Name:</strong> {candidateDetails.name}</p>
//             <p><strong>Father's Name:</strong> {candidateDetails.fatherName}</p>
//             <p><strong>Mother's Name:</strong> {candidateDetails.motherName}</p>
//             <p><strong>Date of Birth:</strong> {candidateDetails.dob}</p>
//             <p><strong>Gender:</strong> {candidateDetails.gender}</p>
//             <p><strong>Category:</strong> {candidateDetails.category}</p>
//             <p><strong>Marital Status:</strong> {candidateDetails.maritalStatus}</p>
//             <p><strong>Mobile Number:</strong> {candidateDetails.contactInfo?.mobileNumber}</p>
//             <p><strong>Email:</strong> {candidateDetails.contactInfo?.email}</p>
//             <div className="flex items-center">
//               <p className="mr-4"><strong>Photo:</strong></p>
//               {proxiedPhotoUrl ? (
//                 <img src={proxiedPhotoUrl} alt="photo" className="mt-2" width={100} height={100} />
//               ) : (
//                 <p>Loading...</p>
//               )}
//             </div>
//             <div className="flex items-center">
//               <p className="mr-4"><strong>Signature:</strong></p>
//               {proxiedSignatureUrl ? (
//                 <img src={proxiedSignatureUrl} alt="signature" className="mt-2" width={100} height={100} />
//               ) : (
//                 <p>Loading...</p>
//               )}
//             </div>
//             <div className="flex items-center col-span-2">
//               <p className="mr-4"><strong>QR Code:</strong></p>
//               <img src={hallTicketDetails.qrCode} alt="QR Code" className="mt-2" width={100} height={100} />
//             </div>
//           </div>
//         </div>
//       )}

//       {hallTicketDetails && (
//         <button
//           onClick={handlePrint}
//           className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
//         >
//           Download Hall Ticket
//         </button>
//       )}
//     </div>
//   );
// };

// export default DownloadHall;
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import { useReactToPrint } from 'react-to-print';

const DownloadHall = () => {
  const [hallTicketNumber, setHallTicketNumber] = useState('');
  const [hallTicketDetails, setHallTicketDetails] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState({});
  const printRef = useRef();
  const [proxiedPhotoUrl, setProxiedPhotoUrl] = useState('');
  const [proxiedSignatureUrl, setProxiedSignatureUrl] = useState('');

  useEffect(() => {
    const savedHallTicketDetails = localStorage.getItem('hallTicketDetails');
    const savedCandidateDetails = localStorage.getItem('candidateDetails');

    if (savedHallTicketDetails) {
      setHallTicketDetails(JSON.parse(savedHallTicketDetails));
    }
    if (savedCandidateDetails) {
      setCandidateDetails(JSON.parse(savedCandidateDetails));
    }
  }, []);

  const fetchProxiedImage = async (url, setImageUrl) => {
    if (!url) return;

    try {
      const response = await fetch(`${BASE_URL}/proxy?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const proxiedImageUrl = `${BASE_URL}${data.url}`;
      setImageUrl(proxiedImageUrl);
    } catch (error) {
      console.error('Error fetching proxied image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/hallticket/${hallTicketNumber}`);
      const hallTicketData = response.data.hallTicket;
      setHallTicketDetails(hallTicketData);

      const candidateResponse = await axios.get(`${BASE_URL}/candidate/${hallTicketData.candidateId}`);
      const candidateData = candidateResponse.data;
      setCandidateDetails(candidateData);

      fetchProxiedImage(candidateResponse.data.photo, setProxiedPhotoUrl);
      fetchProxiedImage(candidateResponse.data.signature, setProxiedSignatureUrl);
    } catch (error) {
      console.error('Error fetching hall ticket details:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${hallTicketDetails?.hallTicketNumber}_HallTicket`,
    onAfterPrint: () => console.log('PDF Downloaded'),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!hallTicketDetails && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Generate Hall Ticket</h2>
          <div className="mb-4">
            <label htmlFor="hallTicketNumber" className="block text-sm font-medium text-gray-600">
              Hall Ticket Number:
            </label>
            <input
              type="text"
              id="hallTicketNumber"
              value={hallTicketNumber}
              onChange={(e) => setHallTicketNumber(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Hall Ticket Number"
            />

            {/* random password for logging into exam in the exam center*/}
            {/* random userid for logging into exam in the exam center*/}

          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      )}

      {hallTicketDetails && (
        <div ref={printRef} className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700 text-center">Hall Ticket Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Hall Ticket:</strong> {hallTicketDetails.hallTicketNumber}</p>
            <p><strong>Exam Center:</strong> {hallTicketDetails.examCenter}</p>
            <p><strong>Candidate Name:</strong> {candidateDetails.name}</p>
            <p><strong>Father's Name:</strong> {candidateDetails.fatherName}</p>
            <p><strong>Mother's Name:</strong> {candidateDetails.motherName}</p>
            <p><strong>Date of Birth:</strong> {candidateDetails.dob}</p>
            <p><strong>Gender:</strong> {candidateDetails.gender}</p>
            <p><strong>Category:</strong> {candidateDetails.category}</p>
            <p><strong>Marital Status:</strong> {candidateDetails.maritalStatus}</p>
            <p><strong>Mobile Number:</strong> {candidateDetails.contactInfo?.mobileNumber}</p>
            <p><strong>Email:</strong> {candidateDetails.contactInfo?.email}</p>
            <div className="flex items-center">
              <p className="mr-4"><strong>Photo:</strong></p>
              {proxiedPhotoUrl ? (
                <img src={proxiedPhotoUrl} alt="photo" className="mt-2" width={100} height={100} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="flex items-center">
              <p className="mr-4"><strong>Signature:</strong></p>
              {proxiedSignatureUrl ? (
                <img src={proxiedSignatureUrl} alt="signature" className="mt-2" width={100} height={100} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="flex items-center col-span-2">
              <p className="mr-4"><strong>QR Code:</strong></p>
              <img src={hallTicketDetails.qrCode} alt="QR Code" className="mt-2" width={100} height={100} />
            </div>
          </div>
        </div>
      )}

      {hallTicketDetails && (
        <button
          onClick={handlePrint}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Download Hall Ticket
        </button>
      )}
    </div>
  );
};

export default DownloadHall;
