//when the login is successful user gets navigated to the dashboard
export default function Dashboard() {
  return (
    <section className="flex flex-col items-center justify-center h-screen text-center px-6 z-20 relative bg-transparent font-sans">
      {/* Animated Heading */}
      <h1 className="text-[#5B9689] md:text-4xl font-extrabold mb-4 tracking-tight drop-shadow animate-fade-in-up">
        <span className="text-[#5B9689] font-large opacity-80 tracking-wide">
          Welcome to Dashboard
        </span>
      </h1>

      {/* Animated Subtext */}
      <p
        className="text-lg md:text-xl text-[#5C8372] mb-8 max-w-2xl leading-relaxed drop-shadow-sm animate-fade-in-up"
        style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
      >
        Under Construction
      </p>
    </section>
  );
}
