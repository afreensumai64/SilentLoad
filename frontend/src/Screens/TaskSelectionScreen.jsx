import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TaskCard from "../components/TaskCard";
import ProgressSlots from "../components/ProgressSlots";
import DelegateModal from "../components/DelegateModal";
import { api } from "../api";

const TaskSelectionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_TASKS = location.state?.capacity || 3;

  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showDelegate, setShowDelegate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tasks.today()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((t) => t !== id));
    } else if (selected.length < MAX_TASKS) {
      setSelected([...selected, id]);
    }
  };

  const isMax = selected.length >= MAX_TASKS;
  const ready = selected.length > 0;
  const remaining = MAX_TASKS - selected.length;
  const selectedTasks = tasks.filter((t) => selected.includes(t.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FB]">
      <div className="h-[3px] bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300" />
      <div className="bg-white px-5 py-5 border-b border-gray-200">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Task Selection</p>
        <h1 className="text-lg font-bold text-gray-900">Choose up to {MAX_TASKS} tasks</h1>
        <p className="text-sm text-gray-400 mt-1">Based on your capacity today</p>
        <ProgressSlots count={selected.length} max={MAX_TASKS} />
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-300 text-sm">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-300 text-sm">No tasks yet. Add some first!</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selected.includes(task.id)}
              isDimmed={isMax && !selected.includes(task.id)}
              onToggle={() => toggle(task.id)}
              onDelegate={() => setShowDelegate(true)}
            />
          ))
        )}
        {isMax && (
          <div className="text-center mt-3 text-sm text-purple-500 font-medium">
            That's your {MAX_TASKS} for today 🌸
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          onClick={() => ready && navigate("/focus-mode", { state: { selectedTaskIds: selected, tasks: selectedTasks } })}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
            ready ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          {ready ? "Start Focus Mode" : `Select tasks to continue`}
          {ready && <ArrowRight size={16} />}
        </button>
      </div>

      <DelegateModal open={showDelegate} onClose={() => setShowDelegate(false)} />
    </div>
  );
};

export default TaskSelectionScreen;
