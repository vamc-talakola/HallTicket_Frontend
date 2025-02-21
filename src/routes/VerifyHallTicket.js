import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

const VerifyHallTicket = () => {
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef(null);
    const effectRan = useRef(false); // Prevent double execution in Strict Mode
    const navigate = useNavigate();

    useEffect(() => {
        if (effectRan.current) return; // 🔥 Prevent second execution in Strict Mode

        startScanning();
        effectRan.current = true; // Mark effect as run

        return () => stopScanning(); // Cleanup on unmount
    }, []);

    const startScanning = () => {
        const qrContainer = document.getElementById("qr-reader");
        qrContainer.innerHTML = ""; // Clear previous instances

        if (scannerRef.current) return; // Prevent multiple scanner instances
        const html5QrCode = new Html5Qrcode("qr-reader");

        html5QrCode
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    stopScanning();
                    verifyQRCode(decodedText);
                },
                (errorMessage) => {
                    console.warn("QR Code scanning error:", errorMessage);
                }
            )
            .then(() => {
                setScanning(true);
                scannerRef.current = html5QrCode;
            })
            .catch(console.error);
    };

    const stopScanning = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                console.log("Scanner stopped successfully."); // Debugging
                setScanning(false);
                scannerRef.current = null; // Clear reference
            }).catch(console.error);
        }
    };

    const verifyQRCode = async (qrData) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/verify-qrcode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrData }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/candidate-details/${qrData}`, { state: { candidate: data } });
            } else {
                alert("Invalid QR Code");
            }
        } catch (error) {
            console.error("Error verifying QR code:", error);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {loading && <p className="text-lg font-semibold">Verifying Hall Ticket...</p>}
            <div>
                <h2 className="text-xl font-semibold text-center mb-4">Scan QR Code</h2>
                <div id="qr-reader" className="w-72 h-72"></div>

                {scanning ? (
                    <button onClick={stopScanning} className="bg-red-500 text-white py-2 px-4 rounded mt-2">
                        Stop Scanning
                    </button>
                ) : (
                    <button onClick={startScanning} className="bg-green-500 text-white py-2 px-4 rounded mt-2">
                        Start Scanning
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyHallTicket;
