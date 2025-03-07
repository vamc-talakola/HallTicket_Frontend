import React, { useEffect, useState } from "react";
import axios from "axios";
import { storage, ref, uploadBytes, getDownloadURL } from "../Firebase";
import BASE_URL from "../config";
import { Navigate, useNavigate } from "react-router-dom";
// import ReCAPTCHA from "react-google-recaptcha";

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
  const [selectedStateAddress, setSelectedStateAddress] = useState("");
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
  const [imageUploading, setImageUploading] = useState(false);
  const [signatureUploading, setSignatureUploading] = useState(false);

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
        const fileSizeInKB = file.size / 1024; // Convert size to KB
        console.log("File size:", fileSizeInKB);

        if (fileSizeInKB > 50) {
            alert("File size must be 50KB or less!");
            event.target.value = ""; // Reset file input
            return;
        }

        setImageUploading(true); // Set uploading state to true

        const storageRef = ref(storage, `hall-ticket/images/${file.name}`); // Define storage path

        try {
            // Upload the file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, file);

            // Get the download URL of the uploaded image
            const url = await getDownloadURL(snapshot.ref);
            setImageUploading(false); // Set uploading state to false
            setImageUrl(url); // Set the image URL in the state
            setFormData((prev) => ({ ...prev, photo: url }));
            console.log("File uploaded successfully! Image URL: ", url);
        } catch (error) {
          setImageUploading(false); // Set uploading state to false
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
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
  } else {
      const dobYear = new Date(formData.dob).getFullYear();
      if (dobYear < 2000) {
          newErrors.dob = "Date of birth must be from the year 2000 or later";
      }
  }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (
      formData.category &&
      formData.category !== "General" && formData.category !== "EWS" &&
      !formData.sub_caste
    )
      newErrors.subcaste = "Subcaste is required";

    if(!formData.addressState) newErrors.addressState = "State is required";


    if (!formData.contactInfo.email) {
      newErrors.email = "Email is required";
  } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|gvpce\.ac\.in)$/.test(formData.contactInfo.email)) {
      newErrors.email = "Enter a valid email address (eg..gmail.com, yahoo.com, or gvpce.ac.in)";
  }

  if (!formData.contactInfo.mobileNumber) {
    newErrors.mobileNumber = "Mobile number is required";
} else if (!/^[6-9]\d{9}$/.test(formData.contactInfo.mobileNumber)) {
    newErrors.mobileNumber = "Mobile number must be 10 digits and start with a number greater than 5 (6, 7, 8, or 9)";
}
    // Aadhar number validation (only if ID Proof is Aadhar)
    if (!formData.idProof) {
      newErrors.idProof = "ID proof is required";
    } else if (!formData.idProofNumber) {
      newErrors.idProofNumber = "ID proof number is required";
    } else {
      switch (formData.idProof) {
        case "Aadhar":
          if (!/^\d{12}$/.test(formData.idProofNumber)) {
            newErrors.idProofNumber = "Aadhar number must be exactly 12 digits";
          } else {
            switch (formData.idProof) {
              case "Aadhar":
                if (!/^\d{12}$/.test(formData.idProofNumber)) {
                  newErrors.idProofNumber = "Aadhar number must be exactly 12 digits";
                } else{
                  const isSequential = (num) => {
                    const ascending = "123456789012";
                    const descending = "987654321098";
                    const other = "012345678901";
                    return (
                      ascending.includes(num) || descending.includes(num) || other.includes(num)
                    );
                  };
              
                  // Check for all identical digits
                  const isIdentical = /^(\d)\1{11}$/.test(formData.idProofNumber);
              
                  if (isSequential(formData.idProofNumber)) {
                    newErrors.idProofNumber =
                      "Aadhar number cannot be a continuous sequence like 123456789012 or 987654321098";
                  } else if (isIdentical) {
                    newErrors.idProofNumber =
                      "Aadhar number cannot have all identical digits like 111111111111";
                  }
                }
                break;
              case "Pan":
                if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.idProofNumber)) {
                  newErrors.idProofNumber = "PAN number must follow the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)";
                }
                break;
              case "Voter":
                if (!/^[A-Z]{3}\d{7}$/.test(formData.idProofNumber)) {
                  newErrors.idProofNumber = "Voter ID must have 3 letters followed by 7 digits (e.g., ABC1234567)";
                }
                break;
              default:
                break;
            }
          }
          break;
        case "Pan":
          if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.idProofNumber)) {
            newErrors.idProofNumber = "PAN number must follow the format: 5 letters, 4 digits, and 1 letter (e.g., ABCDE1234F)";
          }
          break;
        case "Voter":
          if (!/^[A-Z]{3}\d{7}$/.test(formData.idProofNumber)) {
            newErrors.idProofNumber = "Voter ID must have 3 letters followed by 7 digits (e.g., ABC1234567)";
          }
          break;
        default:
          break;
      }
    }

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
    // if(!captchaValue) newErrors.captcha = "Please complete the captcha";
    if (!formData.password) {
      newErrors.password = "Password is required";
  } else if (!/^[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must start with a capital letter";
  } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one digit";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
  } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
  }
  
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
    console.log("Validation Errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignatureChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
        const fileSizeInKB = file.size / 1024; // Convert size to KB
        console.log("File size:", fileSizeInKB);

        if (fileSizeInKB > 30) {
            alert("Signature file size must be 30KB or less!");
            event.target.value = ""; // Reset file input
            return;
        }

        setSignatureUploading(true);

        const storageRef = ref(storage, `hall-ticket/signatures/${file.name}`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            setSignatureUploading(false);
            setSignatureUrl(url);
            setFormData((prev) => ({ ...prev, signature: url }));
            console.log("File uploaded successfully! Signature URL: ", url);
        } catch (error) {
          setSignatureUploading(false);
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
    addressState:"",
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

    if (name === "mobileNumber" && !/^\d*$/.test(value)) {
      return;
  }

  if (formData.idProof === "Aadhar" && name === "idProofNumber" && !/^\d*$/.test(value)) {
      return;
  }

  setFormData((prev) => {
    // Handle nested fields like contactInfo.mobileNumber
    if (name === "mobileNumber") {
        return {
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                mobileNumber: value, // Update only mobileNumber
            },
        };
    }

    return {
        ...prev,
        [name]: value, // Update other fields normally
    };
});
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

  const handleStateForAddressChange = (e) => {
    const stateName = e.target.value;
    setSelectedStateAddress(stateName);
    // fetchCities(stateName);
    // setPreferences([]);
    setFormData((prev) => ({
      ...prev,
      addressState: stateName,
    }));
    setErrors((prev) => ({
      ...prev,
      addressState: "",
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

      <form className="space-y-4 w-[33%] mx-auto" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="text-left">
        <label className="block text-gray-700 mb-1">
           Name
          </label>
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
        <label className="block text-gray-700 mb-1">
          Confirm Name
          </label>
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
        <label className="block text-gray-700 mb-1">
           Father's Name
          </label>
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
        <label className="block text-gray-700 mb-1">
          Confirm Father's Name
          </label>
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
        <label className="block text-gray-700 mb-1">
          Mother's Name
          </label>
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
        <label className="block text-gray-700 mb-1">
          Confirm Mother's Name
          </label>
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
        <label className="block text-gray-700 mb-1">
           Date Of Birth
          </label>
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
        <label className="block text-gray-700 mb-1">
           Gender
          </label>
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
        <label className="block text-gray-700 mb-1">
           Category
          </label>
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

        {formData.category && formData.category !== "General" && formData.category !== "EWS"  && (
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
            {/* <option value="Driving License">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="Voter">Voter ID</option> */}
          </select>
          {errors.idProof && (
            <p className="text-red-500 text-sm">{errors.idProof}</p>
          )}
        </div>

        {/* ID Proof Number (Only visible if ID Proof is selected) */}
        {formData.idProof === "Aadhar" ? (
          <div className="text-left mt-2">
          <label className="block text-gray-700 mb-1">
            Enter Aadhar Number
          </label>
          <input
            type="text"
            name="idProofNumber"
            placeholder={`Enter Aadhar Number`}
            value={formData.idProofNumber}
            onChange={handleInputChange}
            maxLength="12"
            pattern="\d*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.idProofNumber && (
            <p className="text-red-500 text-sm">{errors.idProofNumber}</p>
          )}
        </div>
        )
      : formData.idProof === "Pan" ? (
        <div className="text-left mt-2">
        <label className="block text-gray-700 mb-1">
          Enter PAN Number
        </label>
        <input
          type="text"
          name="idProofNumber"
          placeholder={`Enter PAN Number`}
          value={formData.idProofNumber}
          onChange={handleInputChange}
          maxLength="10"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        {errors.idProofNumber && (
          <p className="text-red-500 text-sm">{errors.idProofNumber}</p>
        )}
      </div>
      )  : formData.idProof === "Voter" ? (
        <div className="text-left mt-2">
        <label className="block text-gray-700 mb-1">
          Enter Voter ID Number
        </label>
        <input
          type="text"
          name="idProofNumber"
          placeholder={`Enter Voter ID Number`}
          value={formData.idProofNumber}
          onChange={handleInputChange}
          maxLength="10"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        {errors.idProofNumber && (
          <p className="text-red-500 text-sm">{errors.idProofNumber}</p>
        )}
      </div>
      ) : formData.idProof ? (
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
      )  : null}

        {/* Marital Status */}
        <div className="text-left">
        <label className="block text-gray-700 mb-1">
           Marital Status
          </label>
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
        

        {/* Permanent Address */}
        <div className="text-left mt-4">
          <label className="block text-gray-700 mb-1">Permanent Address</label>
          <div className="mb-2 flex items-start">
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

        <div className="text-left">
          <label className="block text-gray-700 mb-1">State</label>
          <select
            value={selectedStateAddress}
            onChange={handleStateForAddressChange}
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
        <label className="block text-gray-700 mb-1">
           Mobile Number
          </label>
        <input
  type="text"
  name="mobileNumber"
  placeholder="Mobile Number"
  value={formData.contactInfo.mobileNumber}
  onChange={handleInputChange}
  maxLength="10"
  pattern="\d*"
  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
/>
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
          )}
        </div>

        <div className="flex space-x-4 items-start">
          {/* Email Input */}
          <div className="text-left flex-1">
          <label className="block text-gray-700 mb-1">
           Email
          </label>
            <input
              type="email"
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
          <label className="block text-gray-700 mb-1">
           Enter OTP
          </label>
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
          <div className="text-left flex-1">
            <button
              type="button"
              onClick={sendotp}
              disabled={verified}
              className="w-full px-4 py-2 bg-blue-500 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              send otp
            </button>
          </div>

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
          <label className="block text-gray-700 mb-1">Exam Center Preferred State</label>
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
          <label className="block text-gray-700 mb-1">Preferred Cities</label>
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
        <div className="text-left flex items-start space-x-4 ">
          <div className="text-left w-[70%]">
          <label className="block text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border border-gray-300 rounded-md file:px-4 file:py-2 file:bg-gray-200 file:border-none file:text-gray-700 hover:file:bg-gray-300"
          />
          </div>
          {errors.photo && (
            <p className="text-red-500 text-sm">{errors.photo}</p>
          )}
          {imageUploading ? (
            <p className="text-gray-700">Uploading photo...</p>
          ) : imageUrl ? (
            <div className="text-left">
              <img src={imageUrl} alt="Uploaded" 
              className="mt-4 w-[100px] h-[100px] object-cover" 
              />
            </div>
          ) : null}
        </div>

        {/* Signature */}
        <div className="text-left flex items-start space-x-4">
          <div className="text-left w-[70%]"> 
          <label className="block text-gray-700 mb-1">Signature</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleSignatureChange}
            className="w-full border border-gray-300 rounded-md file:px-4 file:py-2 file:bg-gray-200 file:border-none file:text-gray-700 hover:file:bg-gray-300"
          />
          </div>
          {errors.signature && (
            <p className="text-red-500 text-sm">{errors.signature}</p>
          )}
          {signatureUploading ? (
            <p className="text-gray-700">Uploading signature...</p>
          ) : signatureUrl ? (
            <div className="text-left">
              <img src={signatureUrl} alt="Uploaded"
               className="mt-4 w-[150px] h-[70px] object-cover"
                />
            </div>
          ) : null}
        </div>

        <div className="text-left">
        <label className="block text-gray-700 mb-1">
           Password
          </label>
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
        <label className="block text-gray-700 mb-1">
           Confirm Password
          </label>
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
          {/* {errors.captcha && (
            <p className="text-red-500 text-sm">{errors.declaration}</p>
          )} */}
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









// <div className="mb-4">
// <ReCAPTCHA
//   sitekey="6LeQk94qAAAAAEZb7RXK66A3ntzSWOlUAqpwFsyS" 
//   onChange={(value) => setCaptchaValue(value)}
// />
// {errors.captcha && (
//   <p className="text-red-500 text-sm">{errors.captcha}</p>
// )}
// </div>