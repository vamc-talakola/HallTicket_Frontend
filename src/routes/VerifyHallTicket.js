import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import BASE_URL from "../config";

const VerifyHallTicket = () => {
    const [qrResult, setQrResult] = useState("");
    const [isScanned, setIsScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [candidateDetails, setCandidateDetails] = useState({});
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!scannerRef.current && !isScanned) {
            scannerRef.current = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

            scannerRef.current.render(
                async (decodedText) => {
                    console.log("QR Code Detected:", decodedText);
                    setQrResult(decodedText);
                    scannerRef.current.clear(); // ✅ Stop scanning immediately
                    await verifyQRCode(decodedText);
                },
                (error) => console.error("QR Scan Error:", error)
            );
        }

        return () => {
            if (scannerRef.current) {
                // scannerRef.current.clear();
                // scannerRef.current = null; // ✅ Ensure it gets destroyed
            }
        };
    }, [isScanned]);

    const verifyQRCode = async (qrData) => {
        if (!qrData || isScanned) return;
        setIsScanned(true);
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/verify-qrcode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrData }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("API Response:", data);
                setCandidateDetails(data);
            } else {
                alert("Invalid QR Code");
                setIsScanned(false);
            }
        } catch (error) {
            console.error("Error verifying QR code:", error);
            alert("Something went wrong!");
            setIsScanned(false);
        } finally {
            setLoading(false);
        }
    };

    const handleRescan = () => {
        console.log("Rescan initiated");
        setQrResult("");
        setIsScanned(false);
        setCandidateDetails({});
        if(scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
    };

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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                {!isScanned ? (
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-center mb-4">Scan QR Code</h2>
                        <div id="qr-reader" className="w-96 h-96"></div>
                    </div>
                ) : (
                    <div className="mt-8 p-6 bg-white rounded shadow-lg w-[50%] mx-auto h-[80vh] pl-[5%] pr-[5%]">
                        <h3 className="text-lg font-semibold mt-4 text-center">Candidate Details</h3>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <Detail label="Name" value={candidateDetails?.data?.name} />
                            <Detail label="Father's Name" value={candidateDetails?.data?.fatherName} />
                            <Detail label="Mother's Name" value={candidateDetails?.data?.motherName} />
                            <Detail label="Date of Birth" value={new Date(candidateDetails?.data?.dob).toLocaleDateString()} />
                            <Detail label="Gender" value={candidateDetails?.data?.gender} />
                            <Detail label="Category" value={candidateDetails?.data?.category} />
                            <Detail label="Sub-Caste" value={candidateDetails?.data?.sub_caste} />
                            <Detail label="Marital Status" value={candidateDetails?.data?.maritalStatus} />
                            <Detail label="Phone" value={candidateDetails?.data?.contactInfo?.mobileNumber} />
                            <Detail label="Email" value={candidateDetails?.data?.contactInfo?.email} />
                            <Detail label="Nationality" value={candidateDetails?.data?.nationality} />
                            <Detail label="Address" value={candidateDetails?.data?.temporaryAddress} />
                            <Detail label="Hall Ticket" value={qrResult} />
                            <Detail label="ID Proof" value={`${candidateDetails?.data?.idProof} (${candidateDetails?.data?.idProofNumber})`} />
                            <Detail label="Photo" isImage src={candidateDetails?.data?.photo} />
                            <Detail label="Signature" isSignature src={candidateDetails?.data?.signature} />
                        </div>
                        <button onClick={handleRescan} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Rescan
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// ✅ Helper Component to Render Details
const Detail = ({ label, value, isImage, src,isSignature }) => (
    <div className="flex space-x-4 justify-start">
        <span className="font-medium text-gray-700">{label}:</span>
        {isImage ? (
            <img src={src} alt={label} className="w-20 h-20 border border-gray-400" />
        ) : isSignature ? (
            <img src={src} alt={label} className="w-28 h-16 border border-gray-400" />
        ) :
         (
            <span className="text-gray-900">{value}</span>
        )}
    </div>
);

export default VerifyHallTicket;