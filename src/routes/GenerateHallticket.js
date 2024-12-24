import React, { useEffect, useState } from 'react'
import BASE_URL from '../config';
import RazorpayCheckout from 'react-razorpay';

const GenerateHallticket = () => {
    
function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
    const id=localStorage.getItem("id");
    const [paymentDone,setPaymentDone]=useState(false);
    console.log(id);
    const [candidateDetails,setCandidateDetails]=useState({});
    const handlePayment = async () => {
        // try {
        //     const options = {
        //         description: "Exam Fee",
        //         currency: "INR",
        //         name: "Hall Ticket Automation",
        //         key: "rzp_test_BcjoQSZVtR4JSB",  // Replace with your Razorpay key
        //         amount: 25000,  // Amount in paisa (250 INR = 25000 paise)
        //         prefill: {
        //             email: "void@razorpay.com",
        //             contact: "9999999999",
        //             name: "Razorpay software"
        //         },
        //         theme: { color: "#F37254" }
        //     };
            
        //     // Open the Razorpay checkout window
        //     const response = await RazorpayCheckout.open(options);

        //     console.log("Payment data:", response);

        //     // After successful payment, you can update the state or make a call to your backend
        //     setPaymentDone(true);  // Update the payment status
        // } catch (error) {
        //     console.error('Error fetching candidate details:', error);
        // }
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
          );
      
          if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
          }
        
      
          const options = {
            key: "rzp_test_BcjoQSZVtR4JSB",
            currency:   "INR",
            amount: 300*100,
            name: "Hall Ticket Automation",
            description: "Exam Fee",
              image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcReQVoW0KVXiXmOSt7M0JOWokwDeVUgXVhHiiQahK4n0a9UjPgzEA4bBKngD9Cln5JNWob_hF7Y0QpoKKkBe50rdJHcQyED&usqp=CAE",
           
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
          setPaymentDone(true);
    };
    
    useEffect(()=>{
        const getCandidateDetails=async(id)=>{
            try{
                const response=await fetch((`${BASE_URL}/candidate/${id}`),{
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                if(response.ok){
                    const data=await response.json();
                    setCandidateDetails(data);
    
                }
            }
            catch(error){
                console.error('Error fetching candidate details:', error);
            }
        }
        getCandidateDetails(id);
    },[])
    // console.log(candidateDetails);
    if (!candidateDetails) {
        return <div>Loading...</div>; // Show a loader until data is fetched
      }
  return (
    <div className="container mx-auto mt-8 px-[20%] shadow-2xl w-[80%] rounded-lg py-8">
    <h1 className="text-2xl font-bold mb-6 text-center">Candidate Details</h1>
    <div className="grid grid-cols-2 gap-6">
      {candidateDetails && (
        <>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-900">{candidateDetails.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Father's Name:</span>
            <span className="text-gray-900">
              {candidateDetails.fatherName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Mother's Name:</span>
            <span className="text-gray-900">
              {candidateDetails.motherName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Date of Birth:</span>
            <span className="text-gray-900">
              {new Date(candidateDetails.dob).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="text-gray-900">{candidateDetails.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Category:</span>
            <span className="text-gray-900">{candidateDetails.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">
              Marital Status:
            </span>
            <span className="text-gray-900">
              {candidateDetails.maritalStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Mobile Number:</span>
            <span className="text-gray-900">
              {candidateDetails.contactInfo?.mobileNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">
              {candidateDetails.contactInfo?.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">
              Hall Ticket Generated:
            </span>
            <span className="text-gray-900">
              {candidateDetails.hallTicketGenerated ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Photo:</span>
            <img
              src={candidateDetails.photo}
              alt="Candidate Photo"
              className="w-16 h-16 rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Signature:</span>
            <img
              src={candidateDetails.signature}
              alt="Candidate Signature"
              className="w-16 h-8 rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Exam Fee:</span>
            <span className="text-gray-900">
             300/-
            </span>
          </div>
          
        </>
      )}
     
        
    </div>
    {
        !candidateDetails.status==="approved"
        ?
        (
            <p className='text-red-500 w-full mt-10'>
        waiting for the controller to accept the request
    </p> )
       :
       (
         paymentDone ?<button  className='bg-[#3B82F6] text-white font-semibold py-2 px-[5%] rounded-lg mt-10' >
         Request Hall Ticket
     </button>
     :
        <button onClick={handlePayment} className='bg-[#3B82F6] text-white font-semibold py-2 px-[5%] rounded-lg mt-10' >
            Pay Exam Fee
        </button>
       
     )
      }
  </div>
  )
}

export default GenerateHallticket