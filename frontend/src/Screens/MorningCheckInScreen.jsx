import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Home, Users, Zap, ArrowRight } from "lucide-react";
import AreaCard from "../components/AreaCard";
import { api } from "../api";

const AREAS = [
  { id: "work", label: "Work", desc: "Deadlines & meetings", Icon: Briefcase, bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700", iconBg: "bg-purple-500" },
  { id: "kids", label: "Kids", desc: "School & activities", Icon: Users, bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-600", iconBg: "bg-pink-500" },
  { id: "home", label: "Home", desc: "Chores & errands", Icon: Home, bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-600", iconBg: "bg-orange-400" },
  { id: "unexpected", label: "Unplanned", desc: "Unexpected demands", Icon: Zap, bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-600", iconBg: "bg-violet-500" },
];

const MorningCheckInScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const canContinue = selected.length > 0;

  const handleContinue = async () => {
    if (!canContinue) return;
    setLoading(true);
    try {
      const result = await api.checkins.save(selected);
      navigate("/capacity-result", { state: { capacity: result.capacity, selectedAreas: selected } });
    } catch (err) {
      console.error(err);
      navigate("/capacity-result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FB]">
      <div className="h-[3px] bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300" />
      <div className="flex-1 px-5 pt-7 pb-6 flex flex-col">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Morning Check-in</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">What feels heavy today?</h1>
          <p className="text-sm text-gray-400">Select everything that applies. We'll plan around it.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {AREAS.map((area) => (
            <AreaCard key={area.id} area={area} isSelected={selected.includes(area.id)} onToggle={() => toggle(area.id)} />
          ))}
        </div>
        <div className="flex justify-center mb-5 min-h-[20px]">
          {selected.length > 0
            ? <p className="text-sm text-gray-500">{selected.length} selected</p>
            : <p className="text-xs text-gray-300">Tap to select</p>
          }
        </div>
        <div className="mt-auto">
          <button
            onClick={handleContinue}
            disabled={!canContinue || loading}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold transition ${canContinue && !loading ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}
          >
            {loading ? "Saving..." : "Continue"}
            {canContinue && !loading && <ArrowRight size={16} />}
          </button>
          <p className="text-center mt-3 text-xs text-gray-300">We'll adjust your task limit based on this.</p>
        </div>
      </div>
    </div>
  );
};

export default MorningCheckInScreen;
