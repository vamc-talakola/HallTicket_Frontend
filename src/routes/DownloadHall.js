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
  const candidateId = localStorage.getItem("id");
  const [yourHallTicket, setYourHallTicket] = useState("");

  useEffect(()=>{
    const fetchHallTicketNumber = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/hallticket-number/${candidateId}`);
        const data = response.data;
        const hallTicketNumber = data.hallTicket.hallTicketNumber;
        setYourHallTicket(hallTicketNumber);
      }
      catch (error) {
        console.error('Error fetching hall ticket number:', error);
      }
    }
    fetchHallTicketNumber();
  },[]);

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
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
  
      const blob = await response.blob();
      const imageSrc = URL.createObjectURL(blob);
      console.log(imageSrc);

      setImageUrl(imageSrc);
    } catch (error) {
      console.error('Error fetching proxied image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(hallTicketNumber !== yourHallTicket){
      alert("Please enter your hall ticket number");
      return;
    }
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
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        .print-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1cm;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
        }
        .print-container > * {
          width: 80%;
          margin: 0 auto;
          max-width: 21cm; /* Standard A4 width */
          height: auto;
        }
      }
    `,
    onAfterPrint: () => console.log('PDF Downloaded'),
  });
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      
      {!hallTicketDetails && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Download Hall Ticket</h2>
          {yourHallTicket && 
          <p className="text-center text-2xl font-bold text-blue-500">{yourHallTicket}</p>
      }
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
        <div ref={printRef} className="print-container bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-2xl">
          <div className="text-center border-b pb-4 mb-4">
            <p className="text-xl font-bold">Hall Ticket</p>
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3 text-start">
            <p className="text-sm"><strong>Hall Ticket Number:</strong> {hallTicketDetails?.hallTicketNumber}</p>
              <p className="text-sm"><strong>Candidate Name:</strong> {candidateDetails?.name}</p>
              <p className="text-sm"><strong>Date of Birth (Password):</strong> {new Date(candidateDetails?.dob).toLocaleDateString()}</p>
              
              <p className="text-sm"><strong>Exam Date:</strong> {new Date(hallTicketDetails?.examDate).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Exam Time:</strong> {hallTicketDetails?.examTime}</p>
              <p className="text-sm"><strong>Venue Address:</strong> {hallTicketDetails?.examCenter} , 
                {candidateDetails?.examPreferences?.state}
              </p>
              {/* <p className="text-sm"><strong>Exam Duration:</strong> {hallTicketDetails?.examDuration}</p> */}
            </div>
            <div className="flex flex-col items-end space-y-2">
              <img src={proxiedPhotoUrl} alt="Candidate Photo" className="w-24 h-24 border rounded" />
              <img src={proxiedSignatureUrl} alt="Candidate Signature" className="w-24 h-10 border rounded" />
              <img src={hallTicketDetails?.qrCode} alt="Candidate Signature" className="w-18 h-18 border rounded" />
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
