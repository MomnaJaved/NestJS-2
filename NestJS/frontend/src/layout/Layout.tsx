import { Outlet } from 'react-router-dom';
import bgVideo from '../assets/hero/bg.mp4';
//main layout of the web page
export default function MainLayout() {
  return (
    <div className="relative min-h-screen">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional Blur Overlay */}
      {<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0" />}

      {/* Main Content */}
      <div className="relative z-10 bg-transparent flex flex-col min-h-screen ">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
