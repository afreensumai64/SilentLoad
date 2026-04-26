import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { api } from "../api";

const moodOptions = [
  { id: "drained", emoji: "😔", label: "Drained", desc: "It was a lot", bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-700" },
  { id: "ok", emoji: "😌", label: "Okay", desc: "Got through it", bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-700" },
  { id: "good", emoji: "🌸", label: "Good", desc: "Feeling balanced", bg: "bg-green-100", border: "border-green-400", text: "text-green-700" },
];

const getHero = (done, total) => {
  if (done === total) return { icon: "🌸", title: "You did it.", subtitle: "All tasks done." };
  if (done === 0) return { icon: "🌙", title: "Rest matters.", subtitle: "You chose pause." };
  if (done === total - 1) return { icon: "🌿", title: `${done} done — that counts.`, subtitle: "You knew when to stop." };
  return { icon: "🌿", title: "Progress, not perfection.", subtitle: `${done} of ${total} — that matters.` };
};

const getEncouragement = (mood) => ({
  drained: "You did what you could. Rest now.",
  ok: "You showed up. That's enough.",
  good: "You balanced things well today.",
}[mood]);

const EndOfDayScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completedCount = 0, totalCount = 0 } = location.state || {};
  const [selectedMood, setSelectedMood] = useState(null);
  const [saved, setSaved] = useState(false);

  const done = completedCount;
  const total = totalCount;
  const remaining = total - done;
  const hero = getHero(done, total);

  const handleMoodSelect = async (moodId) => {
    setSelectedMood(moodId);
    if (!saved) {
      setSaved(true);
      try {
        await api.mood.log(moodId, done, total);
      } catch (err) {
        console.error("Failed to log mood:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FB]">
      <div className="h-[3px] bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300" />
      <div className="flex-1 px-5 py-7 flex flex-col">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{hero.icon}</div>
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">{hero.title}</h1>
          <p className="text-sm text-gray-400">{hero.subtitle}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-5">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Today's session</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-extrabold text-gray-900">{done}</span>
            <span className="text-gray-300 text-lg mb-1">of {total}</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">{done} tasks completed</p>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded ${i < done ? "bg-green-400" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs mb-4">
            <span className="text-green-500">{done} done</span>
            {remaining > 0 && <span className="text-gray-300">{remaining} later</span>}
          </div>
          <p className="text-sm text-gray-500">🌿 You chose what mattered most today</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">How are you feeling right now?</p>
          <div className="flex gap-2">
            {moodOptions.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id} onClick={() => handleMoodSelect(mood.id)}
                  className={`flex-1 rounded-xl p-3 border text-center transition ${isSelected ? `${mood.bg} ${mood.border}` : "bg-white border-gray-200"}`}
                >
                  <div className="text-xl">{mood.emoji}</div>
                  <p className={`text-sm font-semibold ${isSelected ? mood.text : "text-gray-700"}`}>{mood.label}</p>
                  <p className="text-xs text-gray-400">{mood.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {selectedMood && (
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700">{getEncouragement(selectedMood)}</p>
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-500 to-purple-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Home size={16} /> Back to Home
          </button>
          <p className="text-center mt-3 text-xs text-gray-300">Rest well. Tomorrow is a new beginning.</p>
        </div>
      </div>
    </div>
  );
};

export default EndOfDayScreen;
