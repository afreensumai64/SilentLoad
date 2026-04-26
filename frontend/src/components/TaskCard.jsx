import { Clock, StickyNote, UserPlus, Check, Trash2 } from "lucide-react";

const CATEGORY = {
  Work: "bg-purple-100 text-purple-700 border-purple-300",
  Kids: "bg-pink-100 text-pink-600 border-pink-300",
  Home: "bg-orange-100 text-orange-600 border-orange-300",
  Personal: "bg-violet-100 text-violet-600 border-violet-300",
};

const TaskCard = ({ task, isSelected = false, isDimmed = false, onToggle, onDelegate, onDelete }) => {
  const catStyle = CATEGORY[task.category] || CATEGORY.Work;
  const isCompleted = task.completed;

  return (
    <div
      onClick={() => { if (!isDimmed && onToggle) onToggle(); }}
      className={`relative rounded-xl border p-4 transition ${
        isCompleted ? "bg-green-50 border-green-200" :
        isSelected ? "bg-purple-50 border-purple-300 shadow-md" :
        "bg-white border-gray-200"
      } ${isDimmed ? "opacity-30 cursor-default" : ""} ${onToggle ? "cursor-pointer" : ""}`}
    >
      <div className="flex gap-3">
        {onToggle && (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
            isCompleted ? "bg-green-500 border-green-500" :
            isSelected ? "bg-purple-500 border-purple-500" : "border-gray-300"
          }`}>
            {(isCompleted || isSelected) && <Check size={12} className="text-white" />}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold mb-2 ${isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {task.time && (
              <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                <Clock size={10} /> {task.time}
              </div>
            )}
            <span className={`text-xs px-2 py-1 rounded-full border ${catStyle}`}>{task.category}</span>
            {isCompleted && <span className="text-xs text-green-500">✓ done</span>}
          </div>
          {task.notes && (
            <div className="flex gap-1 text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded">
              <StickyNote size={10} className="mt-0.5 flex-shrink-0" />
              <span className="truncate">{task.notes}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          {onDelegate && (
            <button onClick={(e) => { e.stopPropagation(); onDelegate(); }} className="text-gray-400 hover:text-purple-500 p-1">
              <UserPlus size={16} />
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-gray-300 hover:text-red-400 transition p-1">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
