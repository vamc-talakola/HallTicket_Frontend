import React, { useEffect, useState } from "react";
import axios from "axios";
import { storage, ref, uploadBytes, getDownloadURL } from "../Firebase";
import BASE_URL from "../config";
import { Navigate, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

{
  /* 
  1.declartion (checkbox) done
  2.captcha
  3.in education details stream,date of passing,
  subcaste field
  disability if yes show a dropdown with values as in screenshot
  nationality :indian
  idproof with options as in the screenshot
  textbox with id proof number
*/
}
const Register = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [otp, seOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [sameAddress, setSameAddress] = useState(false);

  const handlePermanentAddressChange = (e) => {
    if (!sameAddress) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: e.target.value,
      }));
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const storageRef = ref(storage, `hall-ticket/images/${file.name}`); // Define storage path

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const url = await getDownloadURL(snapshot.ref);
        setImageUrl(url); // Set the image URL in the state
        setFormData((prev) => ({ ...prev, photo: url }));
        console.log("File uploaded successfully! Image URL: ", url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  const [educationEntries, setEducationEntries] = useState([]);

  const addEducationEntry = () => {
    setEducationEntries((prev) => [
      ...prev,
      { level: "", schoolName: "", rollNo: "", percentage: "" },
    ]);
  };

  const removeEducationEntry = (index) => {
    setEducationEntries((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[`level_${index}`];
      delete updatedErrors[`schoolName_${index}`];
      delete updatedErrors[`rollNo_${index}`];
      delete updatedErrors[`percentage_${index}`];
      return updatedErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (formData.name !== formData.confirmName)
      newErrors.confirmName = "Names do not match";
    if (!formData.fatherName)
      newErrors.fatherName = "Father's name is required";
    if (formData.fatherName !== formData.confirmFatherName)
      newErrors.confirmFatherName = "Father's names do not match";
    if (!formData.motherName)
      newErrors.motherName = "Mother's name is required";
    if (formData.motherName !== formData.confirmMotherName)
      newErrors.confirmMotherName = "Mother's names do not match";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (
      formData.category &&
      formData.category !== "General" &&
      !formData.sub_caste
    )
      newErrors.subcaste = "Subcaste is required";
    if(!formData.disability) newErrors.disability = "Disability is required";
    if (formData.disability === "Yes" && !formData.disabilityType)
      newErrors.disabilityType = "Disability type is required";
    if (!formData.idProof) newErrors.idProof = "ID proof is required";
    if (formData.idProof && !formData.idProofNumber)
      newErrors.idProofNumber = "ID proof number is required";
    if(!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.maritalStatus)
      newErrors.maritalStatus = "Marital status is required";
    if (!formData.contactInfo.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    if (!formData.contactInfo.email) newErrors.email = "Email is required";
    if (!selectedState) newErrors.state = "State is required";
    //erors for photo and signature
    if (!imageUrl) newErrors.photo = "Please upload a photo";
    if (!signatureUrl) newErrors.signature = "Please upload a signature";
    if(!captchaValue) newErrors.captcha = "Please complete the captcha";
    if(formData.password === "") newErrors.password = "Password is required";
    //chck for declaration
    if (!isDeclarationChecked) newErrors.declaration = "Please accept the declaration";
    if(formData.password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!isDeclarationChecked)
      newErrors.declaration = "Please accept the declaration";
    educationEntries.forEach((entry, index) => {
      if (!entry.level)
        newErrors[`level_${index}`] = "Education level is required";
      if (!entry.schoolName)
        newErrors[`schoolName_${index}`] = "School name is required";
      if (!entry.rollNo)
        newErrors[`rollNo_${index}`] = "Roll number is required";
      if (!entry.percentage)
        newErrors[`percentage_${index}`] = "Percentage is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignatureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `hall-ticket/signatures/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setSignatureUrl(url);
        setFormData((prev) => ({ ...prev, signature: url }));
        console.log("File uploaded successfully! Signature URL: ", url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    confirmName: "",
    fatherName: "",
    confirmFatherName: "",
    motherName: "",
    confirmMotherName: "",
    dob: "",
    gender: "",
    category: "",
    sub_caste: "",
    disability: "",
    disabilityType: "",
    nationality: "Indian",
    idProof: "",
    maritalStatus: "",
    temporaryAddress: "",
    permanentAddress: "",
    pincode: "",
    contactInfo: {
      mobileNumber: "",
      email: "",
    },
    educationInfo: {
      highSchool: {
        schoolName: "",
        rollNo: "",
        percentage: "",
      },
      intermediate: {
        schoolName: "",
        rollNo: "",
        percentage: "",
      },
      graduation: {
        schoolName: "",
        rollNo: "",
        percentage: "",
      },
    },
    examPreferences: {
      state: "",
      cities: [],
    },
    photo: null,
    signature: null,
    password: "",
  });
  const API_KEY = "VmlmdTFKazFiaFRQZGIyTmdPcUtYTGZkdFpVQUFhUVM0U2R5T3IwVQ==";

  // Ensure form data updates if checkbox is checked
  useEffect(() => {
    if (sameAddress) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.temporaryAddress,
      }));
    }
  }, [sameAddress, formData.temporaryAddress]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://api.countrystatecity.in/v1/countries/IN/states",
          {
            headers: {
              "X-CSCAPI-KEY":
                "VmlmdTFKazFiaFRQZGIyTmdPcUtYTGZkdFpVQUFhUVM0U2R5T3IwVQ==",
            },
          }
        );
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleEducationChange = (index, field, value) => {
    const updatedEntries = [...educationEntries];
    updatedEntries[index][field] = value;
    setEducationEntries(updatedEntries);
    setErrors((prev) => ({
      ...prev,
      [`${field}_${index}`]: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Remove error for the field immediately
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCityPreference = (city) => {
    if (preferences.length < 3) {
      setPreferences((prev) => [...prev, city]);
      setFormData((prev) => ({
        ...prev,
        examPreferences: {
          ...prev.examPreferences,
          cities: [...prev.examPreferences.cities, city],
        },
      }));
      setCities((prev) => prev.filter((c) => c !== city));
    }
  };

  const removeCityPreference = (city) => {
    setPreferences((prev) => prev.filter((pref) => pref !== city)); // Remove the city from preferences
    setFormData((prev) => ({
      ...prev,
      examPreferences: {
        ...prev.examPreferences,
        cities: prev.examPreferences.cities.filter((c) => c !== city),
      },
    }));
    setCities((prev) => [...prev, city]); // Add the city back to the dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    //if formData.disability is No , then remove the disabilityType field in formData
    if (formData.disability === "No") {
      const { disabilityType, ...rest } = formData;
      setFormData(rest);
    }

    // Call the form validation method
    if (!validateForm()) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      // Send the registration request
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is successful
      if (response.ok) {
        console.log("Response:", response);
        alert("Registration Successful!");
        navigate("/Login",{ state: { name: "student" }});
      } else {
        // Handle non-200 HTTP status codes
        const errorData = await response.json();
        setVerified(false)
        seOtp("")
        alert(`Registration failed: ${errorData.error || "Unknown error"}`);
        
      }
    } catch (error) {
      // Handle network errors
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     alert("Form submitted successfully!");
  //     console.log("Form data:", formData);
  //   } else {
  //     alert("Please fix the validation errors before submitting.");
  //   }
  // };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    fetchCities(stateName);
    setPreferences([]);
    setFormData((prev) => ({
      ...prev,
      examPreferences: { state: stateName, cities: [] },
    }));
    setErrors((prev) => ({
      ...prev,
      state: "",
    }));
  };

  const fetchCities = async (stateName) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: "India",
          state: stateName,
        }
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const handlePhoneNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleEmialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const sendotp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/send-otp`, {
        email: formData.contactInfo.email,
      });
      if (response.status === 200) {
        console.log("OTP sent successfully");
        setIsOtpSent(true);
        alert("OTP sent successfully");
      }
    } catch (error) {
      console.error("Error sending otp:", error);
    }
  };
  const verifyotp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, {
        email: formData.contactInfo.email,
        otp: otp,
      });
      if (response.status === 200) {
        console.log("OTP verified successfully");
        setIsOtpSent(true);
        setVerified(true);
        alert("OTP verified successfully");
      }
    } catch (error) {
      console.error("Error sending otp:", error);
    }
  };
  return (
    <div className=" mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Registration Form
      </h2>

      <form className="space-y-4 w-[90%] mx-auto" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="text-left">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="text-left">
          <input
            type="text"
            name="confirmName"
            placeholder="Confirm Name"
            value={formData.confirmName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.confirmName && (
            <p className="text-red-500 text-sm">{errors.confirmName}</p>
          )}
        </div>
        {/* Father Name */}
        <div className="text-left">
          <input
            type="text"
            name="fatherName"
            placeholder="Father's Name"
            value={formData.fatherName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.fatherName && (
            <p className="text-red-500 text-sm">{errors.fatherName}</p>
          )}
        </div>
        <div className="text-left">
          <input
            type="text"
            name="confirmFatherName"
            placeholder="Confirm Father's Name"
            value={formData.confirmFatherName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.confirmFatherName && (
            <p className="text-red-500 text-sm">{errors.confirmFatherName}</p>
          )}
        </div>

        {/* Mother Name */}
        <div className="text-left">
          <input
            type="text"
            name="motherName"
            placeholder="Mother's Name"
            value={formData.motherName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.motherName && (
            <p className="text-red-500 text-sm">{errors.motherName}</p>
          )}
        </div>
        <div className="text-left">
          <input
            type="text"
            name="confirmMotherName"
            placeholder="Confirm Mother's Name"
            value={formData.confirmMotherName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.confirmMotherName && (
            <p className="text-red-500 text-sm">{errors.confirmMotherName}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="text-left">
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        </div>

        {/* Gender */}
        <div className="text-left">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Category */}
        <div className="text-left">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="EWS">EWS</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        {formData.category && formData.category !== "General" && (
          <div className="text-left mt-2">
            <input
              type="text"
              name="sub_caste"
              placeholder="Enter Subcaste"
              value={formData.sub_caste}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.subcaste && (
              <p className="text-red-500 text-sm">{errors.subcaste}</p>
            )}
          </div>
        )}

        {/* Disability Selection */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">
            Do you have any disability?
          </label>
          <select
            name="disability"
            value={formData.disability}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Select Disability</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
          {errors.disability && (
            <p className="text-red-500 text-sm">{errors.disability}</p>
          )}
        </div>

        {/* Disability Type (Only visible if "Yes" is selected) */}
        {formData.disability === "Yes" && (
          <div className="text-left mt-2">
            <label className="block text-gray-700 mb-1">
              Select Disability Type
            </label>
            <select
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              <option value="">Select Disability</option>
              <option value="Visual Impairment">Visual Impairment</option>
              <option value="Hearing Impairment">Hearing Impairment</option>
              <option value="Locomotor Disability">Locomotor Disability</option>
              <option value="Intellectual Disability">
                Intellectual Disability
              </option>
            </select>
            {errors.disabilityType && (
              <p className="text-red-500 text-sm">{errors.disabilityType}</p>
            )}
          </div>
        )}

        {/* Nationality (Fixed as Indian) */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">Nationality</label>
          <input
            type="text"
            value="Indian"
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* ID Proof Selection */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">Select ID Proof</label>
          <select
            name="idProof"
            value={formData.idProof}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Select ID Proof</option>
            <option value="Aadhar">Aadhar Card</option>
            <option value="Pan">PAN Card</option>
            <option value="Driving License">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="Voter">Voter ID</option>
          </select>
          {errors.idProof && (
            <p className="text-red-500 text-sm">{errors.idProof}</p>
          )}
        </div>

        {/* ID Proof Number (Only visible if ID Proof is selected) */}
        {formData.idProof && (
          <div className="text-left mt-2">
            <label className="block text-gray-700 mb-1">
              Enter {formData.idProof} Number
            </label>
            <input
              type="text"
              name="idProofNumber"
              placeholder={`Enter ${formData.idProof} Number`}
              value={formData.idProofNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.idProofNumber && (
              <p className="text-red-500 text-sm">{errors.idProofNumber}</p>
            )}
          </div>
        )}

        {/* Marital Status */}
        <div className="text-left">
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Select Marital Status</option>
            <option value="UnMarried">UnMarried</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widow">Widow</option>
            <option value="Divorced">Divorced</option>
            <option value="Jidicially Separated">Jidicially Separated</option>
          </select>
          {errors.maritalStatus && (
            <p className="text-red-500 text-sm">{errors.maritalStatus}</p>
          )}
        </div>

        {/* Temporary Address */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">Temporary Address</label>
          <textarea
            name="temporaryAddress"
            placeholder="Enter your temporary address"
            value={formData.temporaryAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"></textarea>
          {errors.temporaryAddress && (
            <p className="text-red-500 text-sm">{errors.temporaryAddress}</p>
          )}
        </div>

        {/* Checkbox for "Same as Temporary Address" */}
        <div className="mt-4 flex items-start">
          <input
            type="checkbox"
            id="sameAddress"
            checked={sameAddress}
            onChange={(e) => setSameAddress(e.target.checked)}
            className="w-4 h-4 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="sameAddress" className="ml-2 text-sm text-gray-700">
            Same as Temporary Address
          </label>
        </div>

        {/* Permanent Address */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">Permanent Address</label>
          <textarea
            name="permanentAddress"
            placeholder="Enter your permanent address"
            value={
              sameAddress
                ? formData.temporaryAddress
                : formData.permanentAddress
            }
            onChange={handlePermanentAddressChange} // Custom handler
            disabled={sameAddress} // Disable input if same as temporary
            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 ${
              sameAddress ? "bg-gray-100" : ""
            }`}></textarea>
          {errors.permanentAddress && (
            <p className="text-red-500 text-sm">{errors.permanentAddress}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            name="pincode"
            //length should be six
            maxLength={6}
            placeholder="Enter Pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm">{errors.pincode}</p>
          )}
        </div>

        <div className="text-left">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.contactInfo.mobileNumber} // Access the nested field
            onChange={handlePhoneNumberChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
          )}
        </div>

        <div className="flex space-x-4 items-start">
          {/* Email Input */}
          <div className="text-left flex-1">
            <input
              type="text"
              name="email"
              disabled={verified}
              placeholder="Email"
              value={formData.contactInfo.email}
              onChange={handleEmialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* OTP Input */}
          <div className="text-left flex-1">
            <input
              type="text"
              name="otp"
              disabled={verified}
              placeholder="OTP"
              onChange={(e) => seOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
          </div>
        </div>
        <div className="flex space-x-4 items-start">
          {/* send otp button */}
          <div className="text-left flex-1">
            <button
              type="button"
              onClick={sendotp}
              disabled={verified}
              className="w-full px-4 py-2 bg-blue-500 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              send otp
            </button>
          </div>

          {/* verify otp button */}
          <div className="text-left flex-1">
            <button
              type="button"
              onClick={verifyotp}
              disabled={verified}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              verify otp
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Education Information</h3>

          {/* Education Entries */}
          {educationEntries.map((entry, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">Education {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducationEntry(index)}
                  className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Education Level (e.g., 10th, Graduation)"
                value={entry.level}
                onChange={(e) =>
                  handleEducationChange(index, "level", e.target.value)
                }
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
              />
              {errors[`level_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`level_${index}`]}
                </p>
              )}
              <input
                type="text"
                placeholder="School Name"
                value={entry.schoolName}
                onChange={(e) =>
                  handleEducationChange(index, "schoolName", e.target.value)
                }
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
              />
              {errors[`schoolName_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`schoolName_${index}`]}
                </p>
              )}
              <input
                type="text"
                placeholder="Roll Number"
                value={entry.rollNo}
                onChange={(e) =>
                  handleEducationChange(index, "rollNo", e.target.value)
                }
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
              />
              {errors[`rollNo_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`rollNo_${index}`]}
                </p>
              )}
              <input
                type="text"
                placeholder="Percentage"
                value={entry.percentage}
                onChange={(e) =>
                  handleEducationChange(index, "percentage", e.target.value)
                }
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
              />
              {errors[`percentage_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`percentage_${index}`]}
                </p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addEducationEntry}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            + Add Education
          </button>
        </div>

        {/* State */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">State</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state}</p>
          )}
        </div>

        {/* City */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">City</label>
          <select
            onChange={(e) => handleCityPreference(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            disabled={preferences.length === 3}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.cities && (
            <p className="text-red-500 text-sm">{errors.cities}</p>
          )}
        </div>

        {/* City Preferences */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">City Preferences</label>
          <ul className="list-disc ml-5 space-y-2">
            {preferences.map((city, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="text-gray-600">
                  Preference {index + 1}: {city}
                </span>
                <button
                  type="button"
                  onClick={() => removeCityPreference(city)}
                  className="text-red-500 hover:underline">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            onChange={handlePhotoChange}
            className="w-full border border-gray-300 rounded-md file:px-4 file:py-2 file:bg-gray-200 file:border-none file:text-gray-700 hover:file:bg-gray-300"
          />
          {errors.photo && (
            <p className="text-red-500 text-sm">{errors.photo}</p>
          )}
          {imageUrl && (
            <div className="text-left">
              <h3>Uploaded Image:</h3>
              <img src={imageUrl} alt="Uploaded" className="mt-4" />
            </div>
          )}
        </div>

        {/* Signature */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">Signature</label>
          <input
            type="file"
            onChange={handleSignatureChange}
            className="w-full border border-gray-300 rounded-md file:px-4 file:py-2 file:bg-gray-200 file:border-none file:text-gray-700 hover:file:bg-gray-300"
          />
          {errors.signature && (
            <p className="text-red-500 text-sm">{errors.signature}</p>
          )}
          {signatureUrl && (
            <div className="text-left">
              <h3>Uploaded Image:</h3>
              <img src={signatureUrl} alt="Uploaded" className="mt-4" />
            </div>
          )}
        </div>

        {/* Password */}
        <div className="text-left">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="text-left">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="mt-4 flex items-start">
          <input
            type="checkbox"
            id="declaration"
            checked={isDeclarationChecked}
            onChange={(e) => setIsDeclarationChecked(e.target.checked)}
            className="w-4 h-4 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="declaration" className="ml-2 text-sm text-gray-700">
            I hereby declare that i have gone throught the eligibility criteria
            for the post and that i meet the requisite eligiblity conditions. I
            understand that in case any information submitted by me is incorrect
            or concealed, I shall be liable for immediate disqualification or
            any other action as per extant rules . I also declare that I have
            never been dismissed from any Government service.
          </label>
          {errors.captcha && (
            <p className="text-red-500 text-sm">{errors.declaration}</p>
          )}
        </div>

        <div className="mb-4">
          <ReCAPTCHA
            sitekey="6LdCL9AqAAAAAM-jR5DyxHhUzdt2x4jVX1YMwbz2" // Replace with your reCAPTCHA site key
            onChange={(value) => setCaptchaValue(value)}
          />
          {errors.captcha && (
            <p className="text-red-500 text-sm">{errors.captcha}</p>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
