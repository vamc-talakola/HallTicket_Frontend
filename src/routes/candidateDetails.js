import { useLocation, useNavigate, useParams } from "react-router-dom";

const CandidateDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const candidateDetails = location.state?.candidate || {};

    return (
        <div className="mt-8 p-6 bg-white rounded shadow-lg w-[50%] mx-auto h-[80vh]">
            <h3 className="text-lg font-semibold text-center">Candidate Details</h3>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <Detail label="Name" value={candidateDetails?.data?.name} />
                <Detail label="Father's Name" value={candidateDetails?.data?.fatherName} />
                <Detail label="Mother's Name" value={candidateDetails?.data?.motherName} />
                <Detail label="Date of Birth" value={new Date(candidateDetails?.data?.dob).toLocaleDateString()} />
                <Detail label="Gender" value={candidateDetails?.data?.gender} />
                <Detail label="Category" value={candidateDetails?.data?.category} />
                <Detail label="Hall Ticket" value={id} />
                <Detail label="Email" value={candidateDetails?.data?.contactInfo?.email} />
                <Detail label="Phone" value={candidateDetails?.data?.contactInfo?.mobileNumber} />
                <Detail label="ID Proof" value={`${candidateDetails?.data?.idProof} (${candidateDetails?.data?.idProofNumber})`} />
                <Detail label="Photo" isImage src={candidateDetails?.data?.photo} />
                <Detail label="Signature" isSignature src={candidateDetails?.data?.signature} />
            </div>
            <button
                onClick={() => navigate("/verify")}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Rescan
            </button>
        </div>
    );
};

// ✅ Helper Component to Render Details
const Detail = ({ label, value, isImage, src, isSignature }) => (
    <div className="flex space-x-4 justify-start">
        <span className="font-medium text-gray-700">{label}:</span>
        {isImage ? (
            <img src={src} alt={label} className="w-20 h-20 border border-gray-400" />
        ) : isSignature ? (
            <img src={src} alt={label} className="w-28 h-16 border border-gray-400" />
        ) : (
            <span className="text-gray-900">{value}</span>
        )}
    </div>
);

export default CandidateDetails;
