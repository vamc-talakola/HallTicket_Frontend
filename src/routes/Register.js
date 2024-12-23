import React, { useEffect, useState } from "react";
import axios from "axios";
import { storage, ref, uploadBytes, getDownloadURL } from "../Firebase";
import BASE_URL from "../config";

const Register = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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
    setEducationEntries([
      ...educationEntries,
      { level: "", schoolName: "", rollNo: "", percentage: "" },
    ]);
  };

  const removeEducationEntry = (index) => {
    const updatedEntries = educationEntries.filter((_, i) => i !== index);
    setEducationEntries(updatedEntries);
  };



  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required.";
    if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.maritalStatus) newErrors.maritalStatus = "Marital status is required.";
    educationEntries.forEach((entry, index) => {
      if (!entry.level) newErrors[`level_${index}`] = "Education level is required.";
      if (!entry.schoolName)
        newErrors[`schoolName_${index}`] = "School name is required.";
      if (!entry.rollNo) newErrors[`rollNo_${index}`] = "Roll number is required.";
      if (!entry.percentage)
        newErrors[`percentage_${index}`] = "Percentage is required.";
    });
    if (!formData.contactInfo.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.contactInfo.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }

    if (!formData.contactInfo.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors.email = "Invalid email address.";
    }

    const educationFields = ["schoolName", "rollNo", "percentage"];
    Object.keys(formData.educationInfo).forEach((level) => {
      educationFields.forEach((field) => {
        if (!formData.educationInfo[level][field]) {
          newErrors[`${level}_${field}`] = `${field} is required for ${level}.`;
        }
      });
    });

    if (!selectedState) newErrors.state = "State is required.";
    if (preferences.length < 3) newErrors.cities = "Please select 3 city preferences.";

    if (!formData.photo) newErrors.photo = "Photo is required.";
    if (!formData.signature) newErrors.signature = "Signature is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password.";

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

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
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    category: "",
    maritalStatus: "",
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

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://api.countrystatecity.in/v1/countries/IN/states",
          {
            headers: {
              "X-CSCAPI-KEY": "VmlmdTFKazFiaFRQZGIyTmdPcUtYTGZkdFpVQUFhUVM0U2R5T3IwVQ==",
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePhotoChange = (e) => {
  //   setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  // };

  // const handleSignatureChange = (e) => {
  //   setFormData((prev) => ({ ...prev, signature: e.target.files[0] }));
  // };

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // if (validateForm()) {
      console.log("Form Data:", formData);
      //hit the api
      const response =await fetch(`${BASE_URL}/register`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response);
      alert("Registration Successful!");      
    // } else {
    //   alert("Please Fill the details correctly");
    // }

  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    fetchCities(stateName);
    setPreferences([]);
    setFormData((prev) => ({
      ...prev,
      examPreferences: { state: stateName, cities: [] },
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
      contactInfo: {
        ...prev.contactInfo,
        [name]: value, // Update mobileNumber
      },
    }));
  };

  const handleEmialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value, // Update email
      },
    }));
  };
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Registration Form
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}
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
          {errors.motherName && <p className="text-red-500 text-sm">{errors.motherName}</p>}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}          
        </div>

        {/* Category */}
        <div className="text-left">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Category</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="BC">BC</option>
            <option value="EBC">EBC</option>
            <option value="ENS">ENS</option>

          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Marital Status */}
        <div className="text-left">
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          {errors.maritalStatus && <p className="text-red-500 text-sm">{errors.maritalStatus}</p>}
        </div>

        {/* Contact Info */}
        {/* <div className="text-left">">
          <textarea
            name="contactInfo"
            placeholder="Contact Information"
            value={formData.contactInfo}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div> */}
        <div className="text-left">
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.contactInfo.mobileNumber} // Access the nested field
            onChange={handlePhoneNumberChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
        </div>
        <div className="text-left">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.contactInfo.email} // Access the nested field
            onChange={handleEmialChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
      <h3 className="text-xl font-semibold mb-4">Education Information</h3>

      {/* Education Entries */}
      {educationEntries.map((entry, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
          <div className="flex justify-between">
            <h4 className="font-medium">Education {index + 1}</h4>
            <button
              onClick={() => removeEducationEntry(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            placeholder="Education Level (e.g., 10th, Graduation)"
            value={entry.level}
            onChange={(e) => handleEducationChange(index, "level", e.target.value)}
            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
          />
          {errors[`level_${index}`] && (
            <p className="text-red-500 text-sm">{errors[`level_${index}`]}</p>
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
            <p className="text-red-500 text-sm">{errors[`schoolName_${index}`]}</p>
          )}
          <input
            type="text"
            placeholder="Roll Number"
            value={entry.rollNo}
            onChange={(e) => handleEducationChange(index, "rollNo", e.target.value)}
            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
          />
          {errors[`rollNo_${index}`] && (
            <p className="text-red-500 text-sm">{errors[`rollNo_${index}`]}</p>
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
            <p className="text-red-500 text-sm">{errors[`percentage_${index}`]}</p>
          )}
        </div>
      ))}

      <button
        onClick={addEducationEntry}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        + Add Education
      </button>
    </div>

        {/* State */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">State</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>

        {/* City */}
        <div className="text-left">
          <label className="block text-gray-700 mb-1">City</label>
          <select
            onChange={(e) => handleCityPreference(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            disabled={preferences.length === 3}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.cities && <p className="text-red-500 text-sm">{errors.cities}</p>}
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
                  className="text-red-500 hover:underline"
                >
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
          {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
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
          {errors.signature && <p className="text-red-500 text-sm">{errors.signature}</p>}
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
            value={formData?.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
