import { useNavigate } from 'react-router-dom';
//the main page of the web
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center h-screen text-center px-6 z-20 relative bg-transparent font-sans">
      {/* Animated Heading */}
      <h1 className="text-[#5B9689] md:text-4xl font-extrabold mb-4 tracking-tight drop-shadow animate-fade-in-up">
        <span className="text-[#5B9689] font-large opacity-80 tracking-wide">
          University Attendance Management System
        </span>
      </h1>

      {/* Animated Subtext */}
      <p
        className="text-lg md:text-xl text-[#5C8372] mb-8 max-w-2xl leading-relaxed drop-shadow-sm animate-fade-in-up"
        style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
      >
        Sign up to get started or log in if you already have an account.
      </p>

      {/* CTA Button */}
      <div className="flex flex-row items-center justify-center space-x-6 ">
        <button
          onClick={() => navigate('/signup')}
          className="bg-[#3D7068] text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-[#2f5e54] transition transform hover:scale-105 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate('/login')}
          className="bg-[#3D7068] text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-[#2f5e54] transition transform hover:scale-105 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          Login
        </button>
      </div>
    </section>
  );
}
