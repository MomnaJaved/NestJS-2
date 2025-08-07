import SignUpForm from '../components/SignupForm';
//signup page
const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-6">
      <h1 className="text-4xl font-bold text-[#5B9689] mb-6 mt-6">Sign Up</h1>

      {/* SignUpForm component */}
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
