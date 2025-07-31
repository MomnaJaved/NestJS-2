import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import CustomSelect from './CustomSelect';

const SignUpForm = () => {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
    gender: 'Female',
    DOB: '',
    maritalStatus: 'Single',
    CNIC: '',
    code: '',
    status: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (isSuccess) setIsSuccess(false); // reset success on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const response = await axios.post(
        'http://localhost:3001/auth/signup',
        formData,
      );

      if (response.data.message === 'User created successfully') {
        toast.success('Sign Up successful! You can now log in.'); // Success toast
        setIsSuccess(true);
        setIsLoading(false);
        navigate('/login'); // Redirect to login after successful sign up
      } else {
        toast.error('Something went wrong. Please try again.'); // Error toast
      }
    } catch (error: unknown) {
      setIsLoading(false);

      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data as { message: string };
          // Handle specific backend error messages
          if (errorData?.message.includes('email')) {
            toast.error('The email address is already registered.'); // Specific error message for email
          } else if (errorData?.message.includes('password')) {
            toast.error('Password is too weak.'); // Specific error for password
          } else {
            toast.error(errorData?.message || 'Something went wrong'); // Default error message
          }
        } else if (error.request) {
          // Handle network issues (no response)
          toast.error('Network error: Unable to reach the server.');
        } else {
          // General Axios error
          toast.error('An error occurred while processing your request.');
        }
      } else if (error instanceof Error) {
        toast.error('Unexpected error occurred.'); // General JavaScript error
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-transparent p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      {/* Input fields */}
      {[
        { name: 'firstName', label: 'First Name', type: 'text' },
        { name: 'lastName', label: 'Last Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'contact', label: 'Contact', type: 'text' },
        { name: 'DOB', label: 'Date of Birth', type: 'date' },
        { name: 'CNIC', label: 'CNIC', type: 'text' },
      ].map((field) => (
        <div className="mb-4" key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-300"
          >
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            value={formData[field.name as keyof User] as string}
            onChange={handleChange}
            required
            className={`w-full p-3 mt-1 border border-[#3D7068] text-[12px] placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D7068] ${
              formData[field.name as keyof User]
                ? 'text-gray-300'
                : 'text-white'
            } transparent-bg`}
          />
        </div>
      ))}

      {/* Gender Dropdown */}
      <CustomSelect
        label="Gender"
        value={formData.gender}
        onChange={(value) =>
          setFormData({
            ...formData,
            gender: value as 'Female' | 'Male' | 'Other',
          })
        }
        options={['Female', 'Male', 'Other']}
      />

      {/* Marital Status Dropdown */}
      <CustomSelect
        label="Marital Status"
        value={formData.maritalStatus}
        onChange={(value) =>
          setFormData({
            ...formData,
            maritalStatus: value as 'Single' | 'Married' | 'Divorced',
          })
        }
        options={['Single', 'Married', 'Divorced']}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || isSuccess} // disable on loading or success
        className="w-full bg-[#3D7068] text-sm text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-[#2f5e54] transition transform hover:scale-105 animate-fade-in-up disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing Up...' : isSuccess ? 'Done' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;
