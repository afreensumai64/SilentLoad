import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">

      {/* Background blobs */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-purple-300 opacity-30 blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full bg-orange-300 opacity-25 blur-3xl" />
      <div className="absolute top-1/3 right-[-30px] w-48 h-48 rounded-full bg-pink-300 opacity-20 blur-2xl" />

      {/* Floating dots (static for performance) */}
      <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-purple-400/40" />
      <div className="absolute top-[28%] right-[14%] w-1 h-1 rounded-full bg-purple-400/40" />
      <div className="absolute top-[72%] left-[18%] w-1.5 h-1.5 rounded-full bg-purple-400/40" />
      <div className="absolute top-[65%] right-[12%] w-2 h-2 rounded-full bg-purple-400/40" />
      <div className="absolute top-[45%] left-[6%] w-1 h-1 rounded-full bg-purple-400/40" />

      {/* Logo */}
      <div className="relative flex flex-col items-center">

        {/* Glow */}
        <div className="absolute w-80 h-80 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute w-72 h-72 rounded-full bg-purple-300/40 blur-3xl" />

        <img
          src="/silentloadlogo-removebg-preview.png"
          alt="SilentLoad"
          className="relative z-10 w-80 max-w-[82vw] object-contain drop-shadow-[0_18px_35px_rgba(91,33,182,0.28)]"
        />


        <p className="mt-6 text-sm font-medium tracking-[0.28em] uppercase text-purple-500">
          protect your energy
        </p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-300 opacity-60" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-300 opacity-80" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-300 opacity-60" />
      </div>

    </div>
  );
};

export default SplashScreen;
