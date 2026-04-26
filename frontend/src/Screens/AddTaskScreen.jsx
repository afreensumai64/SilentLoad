import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PenLine, Clock, AlignLeft, Check } from "lucide-react";
import { api } from "../api";

const CATEGORIES = [
  { label: "Work", color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-300", dot: "bg-purple-600" },
  { label: "Kids", color: "text-pink-500", bg: "bg-pink-100", border: "border-pink-300", dot: "bg-pink-500" },
  { label: "Home", color: "text-orange-500", bg: "bg-orange-100", border: "border-orange-300", dot: "bg-orange-500" },
  { label: "Personal", color: "text-violet-600", bg: "bg-violet-100", border: "border-violet-300", dot: "bg-violet-600" },
];

const AddTaskScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", category: "", time: "", notes: "" });
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.tasks.add({
        name: formData.name,
        category: formData.category || "Personal",
        time: formData.time,
        notes: formData.notes,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const ctaReady = formData.name.trim().length > 0;
  const inputBase = "w-full bg-white border rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition";
  const getInputStyle = (field) =>
    `${inputBase} ${focusedField === field ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`;
  const iconColor = (field) => (focusedField === field ? "text-purple-500" : "text-gray-300");

  return (
    <div className="min-h-screen bg-[#F8F7FB] flex flex-col">
      <div className="h-[3px] w-full bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300" />
      <div className="bg-white px-5 pt-5 pb-5 border-b border-gray-200 shadow-sm">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">New Task</p>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">What needs your attention?</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Task Name</p>
          <div className="relative">
            <PenLine size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor("name")}`} />
            <input
              type="text" placeholder="e.g. Finish presentation"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className={getInputStyle("name")}
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Category</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = formData.category === cat.label;
              return (
                <button
                  key={cat.label} type="button"
                  onClick={() => setFormData({ ...formData, category: cat.label })}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${isSelected ? `${cat.bg} ${cat.border} shadow-md` : "bg-white border-gray-200"}`}
                >
                  <div className={`w-2 h-2 rounded-full ${cat.dot}`} />
                  <span className={`flex-1 text-left text-sm ${isSelected ? `${cat.color} font-semibold` : "text-gray-600"}`}>{cat.label}</span>
                  {isSelected && <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Time</p>
          <div className="relative">
            <Clock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor("time")}`} />
            <input
              type="time" value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              onFocus={() => setFocusedField("time")} onBlur={() => setFocusedField(null)}
              className={getInputStyle("time")}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">When do you want to tackle this?</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Notes</p>
            <span className="text-xs text-gray-300">optional</span>
          </div>
          <div className="relative">
            <AlignLeft size={16} className={`absolute left-3 top-4 ${iconColor("notes")}`} />
            <textarea
              rows={3} placeholder="Any details, reminders..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              onFocus={() => setFocusedField("notes")} onBlur={() => setFocusedField(null)}
              className={`${getInputStyle("notes")} pt-4 resize-none leading-relaxed`}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-auto pt-2">
          {!ctaReady && <p className="text-center text-xs text-gray-300 mb-2">Add a task name to save</p>}
          <button
            type="submit" disabled={!ctaReady || loading}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition ${ctaReady && !loading ? "bg-gradient-to-r from-pink-400 via-purple-500 to-purple-700 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}
          >
            <Check size={16} />
            {loading ? "Saving..." : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskScreen;
