//user type
export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact: string;
  gender: 'Female' | 'Male' | 'Other';
  DOB: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  CNIC: string;
  code: string;
  status: boolean;
};
