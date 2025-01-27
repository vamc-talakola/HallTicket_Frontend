import { useState } from "react";
import { QrReader } from "react-qr-reader";
import BASE_URL from "../config";

const VerifyHallTicket = () => {
  const [qrResult, setQrResult] = useState("");
  const [isScanned, setIsScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [candidateDetails,setCandidateDetails]=useState({});

  // This function is called when the QR code is scanned successfully
  const handleResult = async(result) => {
    if (result && result.text && !isScanned) {
      setQrResult(result.text);
      setLoading(true);
      const response = await fetch(`${BASE_URL}/verify-qrcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrData: result.text,
        }),
      });
        if (response.ok) {
            const data = await response.json();
            setLoading(false);
            setCandidateDetails(data);
        } else {
            setLoading(false);
            alert("Invalid QR Code");
        }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  // Function to reset scanning state
  const handleRescan = () => {
    setIsScanned(false);  // Allow new scans after reset
    setQrResult("");      // Clear the previous result
  };
console.log(candidateDetails)

return (
    <>
        {loading && (
            <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded shadow-lg text-center">
                    <p className="text-lg font-semibold">Verifying Hall Ticket...</p>
                    <p>Please wait...</p>
                </div>
            </div>
        )}
        <div className="flex items-center justify-center min-h-screen  bg-gray-100">
            <div className="mt-8 p-6 bg-white rounded shadow-lg w-[90%] max-w-md">
                <h2 className="text-xl font-semibold text-center">Scan QRCode</h2>
                <QrReader
                    delay={300}
                    onResult={handleResult}  
                    onError={handleError}
                    style={{ width: "300px" }}
                />
                {qrResult && (
                    <div className="mt-4">
                    <div>
                        <h3 className="text-lg font-semibold mt-4">Candidate Details</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Name:</span>
                                <span className="text-gray-900">{candidateDetails.data.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Email:</span>
                                <span className="text-gray-900">{candidateDetails.data.contactInfo.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Phone:</span>
                                <span className="text-gray-900">{candidateDetails.data.contactInfo.mobileNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Hall Ticket:</span>
                                <span className="text-gray-900">{qrResult}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Father's name:</span>
                                <span className="text-gray-900">{candidateDetails.data.fatherName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Date of birth:</span>
                                <span className="text-gray-900">{candidateDetails.data.dob}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">category</span>
                                <span className="text-gray-900">{candidateDetails.data.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Mother's name:</span>
                                <span className="text-gray-900">{candidateDetails.data.motherName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Photo:</span>
                                <img src={candidateDetails.data.photo} alt="Candidate" className="w-20 h-20" />
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">signature:</span>
                                <img src={candidateDetails.data.signature} alt="Candidate" className="w-20 h-20" />
                            </div>
                            
                        </div>
                    </div>
                        <button
                            onClick={handleRescan}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Rescan
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>
  );
};

export default VerifyHallTicket;
