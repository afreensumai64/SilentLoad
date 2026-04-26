import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ChevronRight, LogOut } from "lucide-react";
import NavHeader from "../components/NavHeader";
import TaskCard from "../components/TaskCard";
import CapacityCard from "../components/CapacityCard";
import { api, getUser, clearSession } from "../api";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ capacity: 5, todayTaskCount: 0, todayCompleted: 0 });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    loadData();
  }, []);

  async function loadData() {
    try {
      const [todayTasks, dashStats] = await Promise.all([
        api.tasks.today(),
        api.stats.dashboard(),
      ]);
      setTasks(todayTasks);
      setStats(dashStats);
    } catch (err) {
      if (err.message.includes("token")) { clearSession(); navigate("/auth"); }
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleComplete(taskId) {
    try {
      const updated = await api.tasks.toggleComplete(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(taskId) {
    try {
      await api.tasks.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  }

  function handleLogout() {
    clearSession();
    navigate("/auth");
  }

  // Show ALL tasks — no capacity cap on dashboard list
  const displayedTasks = showAll ? tasks : tasks;
  const completedCount = tasks.filter((t) => t.completed).length;
  const userName = user?.name || "Friend";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FB]">
      <NavHeader userName={userName} onLogout={handleLogout} />
      <div className="flex-1 px-5 pt-6 pb-8 flex flex-col">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-gray-400">Today</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Hi, {userName}.</h1>
          <p className="text-sm text-gray-400 mt-1">
            {loading ? "Loading..." : `${completedCount}/${tasks.length} tasks done today.`}
          </p>
        </div>

        <CapacityCard capacity={tasks.length} max={stats.capacity} />

        <button
          onClick={() => navigate("/morning-checkin")}
          className="w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-pink-400 via-purple-500 to-purple-700 shadow-lg flex items-center justify-center gap-2 mb-2"
        >
          <Play size={16} />
          Start My Day
        </button>

        <button
          onClick={() => navigate("/add-task")}
          className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={16} />
          Add Task
        </button>

        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-widest text-gray-400">Today's Tasks</span>
            <button
              onClick={() => navigate("/end-of-day", { state: { completedCount, totalCount: tasks.length } })}
              className="flex items-center text-xs text-purple-500"
            >
              End of Day <ChevronRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-300 text-sm">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-300 text-sm">No tasks yet today.</p>
              <p className="text-gray-300 text-xs mt-1">Tap "Add Task" to get started 🌸</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleComplete(task.id)}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
