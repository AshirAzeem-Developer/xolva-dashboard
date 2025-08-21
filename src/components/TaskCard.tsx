import { Clock, Edit2, Tag, Trash2, User2 } from "lucide-react";
import { useState } from "react";
import { Task, User } from "../types/auth";

export const TaskCard: React.FC<{
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  currentUser: User;
}> = ({ task, onUpdate, onDelete, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showActions, setShowActions] = useState(false);

  const canEdit =
    currentUser.role === "admin" ||
    currentUser.role === "manager" ||
    task.createdBy === currentUser.id ||
    task.assigneeId === currentUser.id;

  const canDelete =
    currentUser.role === "admin" ||
    currentUser.role === "manager" ||
    task.createdBy === currentUser.id;

  const handleSave = () => {
    if (editTitle.trim() !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      draggable
    >
      <div className="flex items-start justify-between mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditTitle(task.title);
                setIsEditing(false);
              }
            }}
            className="font-semibold text-gray-900 bg-transparent border-none outline-none w-full"
            autoFocus
          />
        ) : (
          <h3
            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={() => canEdit && setIsEditing(true)}
          >
            {task.title}
          </h3>
        )}

        {showActions && (canEdit || canDelete) && (
          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
            >
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 text-xs rounded-full border ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <User2 size={12} className="mr-1" />
            {task.assigneeName}
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Clock size={12} className="mr-1" />
          {new Date(task.updatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
