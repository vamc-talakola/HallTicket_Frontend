import React, { useEffect, useState } from 'react'
import BASE_URL from '../config';
import RazorpayCheckout from 'react-razorpay';
import userStore from '../store/userStore';
import { useObserver } from 'mobx-react';
import { useStores } from '../store';

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
    const {UserStore} = useStores();
    const [candidateDetails,setCandidateDetails]=useState({});
    const [loading, setLoading] = useState(true);
    
  useEffect(()=>{
      UserStore.setPaymentDone(candidateDetails.paymentStatus)
      UserStore.setHallTicketRequested(candidateDetails.hallticketRequestSent)
      setLoading(false);
  },[candidateDetails])
 // Initialize loading state




    const handlePayment = async () => {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }
    
      const options = {
        key: "rzp_test_BcjoQSZVtR4JSB", // Replace with your test key
        currency: "INR",
        amount: 300 * 100, // Amount in paise
        name: "Hall Ticket Automation",
        description: "Exam Fee",
        image:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcReQVoW0KVXiXmOSt7M0JOWokwDeVUgXVhHiiQahK4n0a9UjPgzEA4bBKngD9Cln5JNWob_hF7Y0QpoKKkBe50rdJHcQyED&usqp=CAE",
    
        // Handler function for success
        handler: async function (response) {
          alert("Payment Successful!");
          console.log("Payment Successful:", response);
          // setPaymentDone(true);
          const verificationRes = await fetch(`${BASE_URL}/update-payment-status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id:id,
              paymentStatus: true,
            }),
          });
          const data = await verificationRes.json();
          if (data.status === "success") {
            console.log("Payment verified successfully");
            setCandidateDetails(data.candidate);
             // Update your payment state
          } else {
            console.error("Payment verification failed");
          }
          UserStore.setPaymentDone(true);
        },
    
        // Callback for closing the payment window without completion
        modal: {
          ondismiss: function () {
            alert("Payment process was cancelled by the user.");
          },
        },
      };
    
      const paymentObject = new window.Razorpay(options);
    
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment Failed:", response);
        alert("Payment Failed. Please try again.");
      });
    
      paymentObject.open();
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


    const requestHallTicket=async()=>{
      try{
          const response=await fetch(`${BASE_URL}/request-hallticket`,{
            method:'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body:JSON.stringify({
              candidateId:id,
              paymentStatus:UserStore.paymentDone
          })
          })
          if(response.ok){
            const data=await response.json();
            setCandidateDetails(data.candidate)
            alert('Hall ticket requested successfully');
            UserStore.setHallTicketRequested(data.candidate.hallticketRequestSent);
          }
      }
      catch(error){
        console.error('Error requesting hall ticket:', error);
      }
    }

    //if candidate details are not fetched yet, then show a loading at the center of the screen

  return  useObserver(()=>(
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
        candidateDetails.status==="pending"
        ?
        (
            <p className='text-red-500 w-full mt-10'>
              waiting for the controller to approve your registration
            </p> 
    )
       :
       (
        UserStore.paymentDone ?
         <>
         {UserStore.hallTicketRequested ? (
          <p className='text-red-500 w-full mt-10'> Hall request sent to controller successfully.check your email for further updates</p>
          )
          :
          (
            <button onClick={requestHallTicket} className='bg-[#3B82F6] text-white font-semibold py-2 px-[5%] rounded-lg mt-10' >
            Request Hall Ticket
        </button>
          )}
         </>        
     :
        <button onClick={handlePayment} className='bg-[#3B82F6] text-white font-semibold py-2 px-[5%] rounded-lg mt-10' >
            Pay Exam Fee
        </button>
       
     )
      }
  </div>
  ))
}

export default GenerateHallticket