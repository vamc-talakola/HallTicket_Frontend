import React, { useState } from 'react'
import axios from 'axios'
import BASE_URL from '../config'
import {  useLocation, useNavigate } from 'react-router-dom'
import userStore from '../store/userStore'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const location = useLocation();
  const navigate = useNavigate(); 
  const name = location.state?.name;
  const handleSubmit = async () => {
    if(name=="student"){
      try {
        setError('')
        setLoading(true)
        const response =await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(response)
        if (response.status === 200) {
          userStore.setRole("student")
          // Redirect to dashboard
          alert("Login Successfull")
          navigate('/')
        } else {
          setError('Invalid credentials')
        }
      }
      catch (error) {
        setError('Something went wrong')
      }
    }
    else{
      try {
        setError('')
        setLoading(true)
        const response =await fetch(`${BASE_URL}/login/${name}`, {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(response)
        if (response.status === 200) {
          userStore.setRole(name)
          // Redirect to dashboard
          alert("Login Successfull")
          navigate('/')
        } else {
          setError('Invalid credentials')
        }
      }
      catch (error) {
        setError('Something went wrong')
      }
    }
  }
        


  return (
   <>
    <h1 className="text-2xl font-bold pt-[2%] bg-gray-100">Login as {name} </h1>
    <div className="flex flex-col h-[75vh] items-center justify-center bg-gray-100 ">
      <div className="bg-white w-4/5 max-w-md  rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">LOGIN</h2>
        <div className="w-full">
          {/* Input Fields */}
          <input
            type="text"
            placeholder="email"
            name="email"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="email"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Submit Button */}
          <button className="w-full bg-[#3B82F6] text-white font-semibold py-2 rounded-lg " onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

    </div>
   </>
  )
}

export default Login