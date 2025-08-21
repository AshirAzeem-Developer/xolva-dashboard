import React, { useState } from "react";
import { MOCK_USERS, useAuth } from "../context/AuthContext";
import { DashboardState, Task, User } from "../types/auth";
import {
  Bell,
  Filter,
  Search,
  Settings,
  Shield,
  UserCheck,
  Users,
  Wifi,
  Plus,
  TrendingUp,
} from "lucide-react";
import { UserProfile } from "../components/auth/userProfile";
import { TaskCard } from "../components/TaskCard";

export const Home: React.FC = () => {
  const { auth, logout, updateProfile } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Initial dashboard state with sample tasks
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    tasks: [
      {
        id: "1",
        title: "Design Homepage",
        description: "Create wireframes and mockups for the new homepage",
        status: "todo",
        priority: "high",
        assigneeId: "4",
        assigneeName: "Sarah Wilson",
        createdBy: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["design", "ui/ux"],
      },
      {
        id: "2",
        title: "Setup Authentication",
        description: "Implement user login and registration system",
        status: "inprogress",
        priority: "high",
        assigneeId: "3",
        assigneeName: "John Doe",
        createdBy: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["backend", "security"],
      },
      {
        id: "3",
        title: "Write Unit Tests",
        description: "Create comprehensive test coverage",
        status: "done",
        priority: "medium",
        assigneeId: "3",
        assigneeName: "John Doe",
        createdBy: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["testing", "qa"],
      },
    ],
    users: MOCK_USERS.map(({ password, ...user }) => user as User),
    filter: {
      status: "all",
      priority: "all",
      assignee: "all",
      search: "",
    },
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setDashboardState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    }));
  };

  const deleteTask = (id: string) => {
    const task = dashboardState.tasks.find((t) => t.id === id);
    setDashboardState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));

    if (task) {
      setNotifications((prev) => [
        `Task "${task.title}" deleted!`,
        ...prev.slice(0, 4),
      ]);
      setTimeout(() => setNotifications((prev) => prev.slice(0, -1)), 3000);
    }
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    updateTask(taskId, { status: newStatus });
    setNotifications((prev) => [
      `Task moved to ${newStatus.replace("inprogress", "In Progress")}!`,
      ...prev.slice(0, 4),
    ]);
    setTimeout(() => setNotifications((prev) => prev.slice(0, -1)), 2000);
  };

  const setFilter = (filterUpdates: Partial<DashboardState["filter"]>) => {
    setDashboardState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...filterUpdates },
    }));
  };

  const getFilteredTasks = () => {
    return dashboardState.tasks.filter((task) => {
      const matchesStatus =
        dashboardState.filter.status === "all" ||
        task.status === dashboardState.filter.status;
      const matchesPriority =
        dashboardState.filter.priority === "all" ||
        task.priority === dashboardState.filter.priority;
      const matchesAssignee =
        dashboardState.filter.assignee === "all" ||
        task.assigneeName === dashboardState.filter.assignee;
      const matchesSearch =
        dashboardState.filter.search === "" ||
        task.title
          .toLowerCase()
          .includes(dashboardState.filter.search.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(dashboardState.filter.search.toLowerCase());

      return (
        matchesStatus && matchesPriority && matchesAssignee && matchesSearch
      );
    });
  };

  const filteredTasks = getFilteredTasks();

  // Group tasks by status
  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-slate-500",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      tasks: filteredTasks.filter((task) => task.status === "todo"),
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      tasks: filteredTasks.filter((task) => task.status === "inprogress"),
    },
    {
      id: "done",
      title: "Done",
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      tasks: filteredTasks.filter((task) => task.status === "done"),
    },
  ];

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      moveTask(taskId, newStatus);
    }
  };

  const stats = {
    total: dashboardState.tasks.length,
    completed: dashboardState.tasks.filter((t) => t.status === "done").length,
    inProgress: dashboardState.tasks.filter((t) => t.status === "inprogress")
      .length,
    highPriority: dashboardState.tasks.filter((t) => t.priority === "high")
      .length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const onlineUsers = dashboardState.users.filter((user) => user.isOnline);
  const activeFiltersCount = Object.values(dashboardState.filter).filter(
    (value) => value !== "all" && value !== ""
  ).length;

  if (!auth.user) return null;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300"
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 w-[40%]">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Secured Dashboard
                  </p>
                  <p className="text-xs text-slate-500">Project Management</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                  <TrendingUp className="text-emerald-600" size={16} />
                  <span className="font-medium text-emerald-700">
                    {completionRate}%
                  </span>
                  <span className="text-emerald-600">Complete</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-medium">{stats.inProgress}</span> In
                  Progress
                </div>
                <div className="text-slate-600">
                  <span className="font-medium text-red-600">
                    {stats.highPriority}
                  </span>{" "}
                  High Priority
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 ">
              {/* Current User */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {auth.user.avatar}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-800">
                    {auth.user.name}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {auth.user.role}
                  </div>
                </div>
              </div>

              {/* Stats Pills */}
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {stats.total}
                    </div>
                    <div className="text-xs text-blue-500">Total</div>
                  </div>
                  <div className="w-px h-8 bg-blue-200"></div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">
                      {stats.completed}
                    </div>
                    <div className="text-xs text-emerald-500">Done</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {notifications.length}
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setShowProfile(true)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Team Status Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <Wifi size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {onlineUsers.length} online
                  </span>
                </div>
              </div>

              <div className="flex -space-x-2 ">
                {dashboardState.users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className={`relative inline-block ${
                      user.id === auth.user?.id
                        ? "ring-3 ring-red-950 ring-offset-2  rounded-full z-10"
                        : ""
                    }`}
                    title={`${user.name} - ${
                      user.isOnline ? "Online" : "Offline"
                    }`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm">
                      {user.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        user.isOnline ? "bg-emerald-400" : "bg-slate-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Real-time collaboration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={dashboardState.filter.search}
                onChange={(e) => setFilter({ search: e.target.value })}
                className="placeholder:text-slate-900 w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all text-sm font-medium ${
                isFilterOpen
                  ? "bg-blue-50 border-blue-300 text-white shadow-sm"
                  : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter size={16} color="white" />
              <span className="text-white">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Count */}
            <div className="text-sm text-slate-600 bg-slate-100 px-4 py-3 rounded-lg">
              <span className="font-medium ">{filteredTasks.length}</span>
              <span className="ml-1 font-bold">tasks</span>
            </div>

            {/* Add Task Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <Plus size={16} />
              Add Task
            </button>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Status
                  </label>
                  <select
                    value={dashboardState.filter.status}
                    onChange={(e) => setFilter({ status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Priority
                  </label>
                  <select
                    value={dashboardState.filter.priority}
                    onChange={(e) => setFilter({ priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Assignee
                  </label>
                  <select
                    value={dashboardState.filter.assignee}
                    onChange={(e) => setFilter({ assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="all">All Team Members</option>
                    {dashboardState.users.map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6 ">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.bgColor} rounded-xl p-4 min-h-[650px] w-80 flex-shrink-0 border ${column.borderColor} shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h2 className="font-semibold text-slate-800 text-base">
                    {column.title}
                  </h2>
                  <span className="bg-white/60 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                className="min-h-[550px] transition-colors duration-200 rounded-lg p-2"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Task["status"])}
              >
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-move"
                    >
                      <TaskCard
                        task={task}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        currentUser={auth.user!}
                      />
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {column.tasks.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-sm font-medium">
                      No {column.title.toLowerCase()} tasks
                    </p>
                    <p className="text-xs mt-1">
                      Drag tasks here or create new ones
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Authentication Demo Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={18} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Authentication & Authorization
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <UserCheck className="mx-auto mb-3 text-blue-600" size={24} />
              <div className="text-sm font-medium text-slate-800 mb-1">
                Current User
              </div>
              <div className="text-lg font-bold text-blue-600">
                {auth.user.name}
              </div>
              <div className="text-xs text-slate-500 capitalize bg-white px-2 py-1 rounded mt-2">
                {auth.user.role}
              </div>
            </div>

            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <Shield className="mx-auto mb-3 text-emerald-600" size={24} />
              <div className="text-sm font-medium text-slate-800 mb-1">
                Permissions
              </div>
              <div className="text-lg font-bold text-emerald-600">
                {auth.user.permissions.length}
              </div>
              <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded mt-2">
                Resources
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Wifi className="mx-auto mb-3 text-purple-600" size={24} />
              <div className="text-sm font-medium text-slate-800 mb-1">
                Session
              </div>
              <div className="text-lg font-bold text-purple-600">Active</div>
              <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded mt-2">
                Secure Token
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Users className="mx-auto mb-3 text-orange-600" size={24} />
              <div className="text-sm font-medium text-slate-800 mb-1">
                Team Status
              </div>
              <div className="text-lg font-bold text-orange-600">
                {onlineUsers.length}/{dashboardState.users.length}
              </div>
              <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded mt-2">
                Online Now
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Shield size={16} className="text-slate-600" />
              Role-Based Access Control
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <strong className="text-slate-700">Admin:</strong>
                  <span className="text-slate-600">Full system access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong className="text-slate-700">Manager:</strong>
                  <span className="text-slate-600">Task & team management</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong className="text-slate-700">Developer:</strong>
                  <span className="text-slate-600">Create & edit tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <strong className="text-slate-700">Designer:</strong>
                  <span className="text-slate-600">Design-focused tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* User Profile Modal */}
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
};
