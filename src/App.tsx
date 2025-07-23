import React, { useState } from "react";
import {
  Fingerprint,
  CreditCard,
  Eye,
  Users,
  Shield,
  ChevronDown,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

interface User {
  id: string;
  fullName: string;
  idNumber: string;
  role: string;
  authMethods: ("face" | "rfid" | "fingerprint")[];
  status: "Active" | "Inactive";
  registeredAt: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<
    "face" | "rfid" | "fingerprint" | "users"
  >("fingerprint");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1001",
      fullName: "John Doe",
      idNumber: "STU001",
      role: "Lecturer",
      authMethods: ["face", "rfid"],
      status: "Active",
      registeredAt: "2024-01-15",
    },
    {
      id: "1002",
      fullName: "Jane Smith",
      idNumber: "STU002",
      role: "Student",
      authMethods: ["fingerprint", "rfid"],
      status: "Active",
      registeredAt: "2024-01-16",
    },
    {
      id: "1003",
      fullName: "Robert Johnson",
      idNumber: "FAC001",
      role: "Staff",
      authMethods: ["rfid"],
      status: "Active",
      registeredAt: "2024-01-17",
    },
    {
      id: "1004",
      fullName: "Emily Davis",
      idNumber: "STU003",
      role: "Student",
      authMethods: ["face"],
      status: "Active",
      registeredAt: "2024-01-18",
    },
    {
      id: "1005",
      fullName: "Michael Wilson",
      idNumber: "FAC002",
      role: "Lecturer",
      authMethods: ["face", "fingerprint"],
      status: "Active",
      registeredAt: "2024-01-19",
    },
  ]);
  const [loading, setLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    role: "Student",
  });

  const handleTabChange = (
    newTab: "face" | "rfid" | "fingerprint" | "users"
  ) => {
    if (newTab === activeTab) return;

    setIsTransitioning(true);

    // Short delay for fade out effect
    setTimeout(() => {
      setActiveTab(newTab);
      // Longer delay for fade in effect
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };
  const handleRegister = async (type: "face" | "rfid" | "fingerprint") => {
    if (!formData.fullName.trim() || !formData.idNumber.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(type);

    // Simulate registration process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check if user already exists by ID number
    const existingUserIndex = users.findIndex(
      (user) => user.idNumber === formData.idNumber.trim()
    );

    if (existingUserIndex !== -1) {
      // Add new auth method to existing user
      const updatedUsers = [...users];
      const existingUser = updatedUsers[existingUserIndex];

      if (!existingUser.authMethods.includes(type)) {
        existingUser.authMethods.push(type);
        setUsers(updatedUsers);
      }
    } else {
      // Create new user
      const newUser: User = {
        id: (1000 + users.length + 1).toString(),
        fullName: formData.fullName.trim(),
        idNumber: formData.idNumber.trim(),
        role: formData.role,
        authMethods: [type],
        status: "Active",
        registeredAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setLoading(null);
    setFormData({ fullName: "", idNumber: "", role: "Student" });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setEditingUser(null);
    }
  };

  const handleAuthMethodToggle = (method: "face" | "rfid" | "fingerprint") => {
    if (editingUser) {
      const updatedMethods = editingUser.authMethods.includes(method)
        ? editingUser.authMethods.filter((m) => m !== method)
        : [...editingUser.authMethods, method];

      setEditingUser({
        ...editingUser,
        authMethods: updatedMethods,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "face", label: "Face ID", icon: Eye },
    { id: "rfid", label: "RFID", icon: CreditCard },
    { id: "fingerprint", label: "Fingerprint", icon: Fingerprint },
    { id: "users", label: "Registered Users", icon: Users },
  ];

  const getThemeColors = (tab: string) => {
    switch (tab) {
      case "face":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
          scanner: "border-blue-300 bg-blue-50",
          scannerText: "text-blue-700",
          active: "bg-blue-50 text-blue-800 border-blue-200",
          dot: "bg-blue-600",
        };
      case "rfid":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: "text-green-600",
          button: "bg-green-600 hover:bg-green-700",
          scanner: "border-green-300 bg-green-50",
          scannerText: "text-green-700",
          active: "bg-green-50 text-green-800 border-green-200",
          dot: "bg-green-600",
        };
      case "fingerprint":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          icon: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700",
          scanner: "border-amber-300 bg-amber-50",
          scannerText: "text-amber-700",
          active: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-600",
        };
      case "users":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-800",
          icon: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700",
          scanner: "border-purple-300 bg-purple-50",
          scannerText: "text-purple-700",
          active: "bg-purple-50 text-purple-800 border-purple-200",
          dot: "bg-purple-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          icon: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700",
          scanner: "border-gray-300 bg-gray-50",
          scannerText: "text-gray-700",
          active: "bg-gray-50 text-gray-800 border-gray-200",
          dot: "bg-gray-600",
        };
    }
  };

  const currentTheme = getThemeColors(activeTab);

  const getTabTitle = () => {
    switch (activeTab) {
      case "face":
        return "Face ID";
      case "rfid":
        return "RFID";
      case "fingerprint":
        return "Fingerprint";
      case "users":
        return "Registered Users";
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case "face":
        return "Register new face recognition authentication method";
      case "rfid":
        return "Register new RFID card authentication method";
      case "fingerprint":
        return "Register new fingerprint authentication method";
      case "users":
        return `${filteredUsers.length} of ${users.length} Users`;
    }
  };

  const getScannerContent = () => {
    switch (activeTab) {
      case "face":
        return {
          icon: <Eye className={`w-16 h-16 ${currentTheme.icon}`} />,
          text: "Look at the camera to scan your face",
        };
      case "rfid":
        return {
          icon: <CreditCard className={`w-16 h-16 ${currentTheme.icon}`} />,
          text: "Place your RFID card on the scanner",
        };
      case "fingerprint":
        return {
          icon: <Fingerprint className={`w-16 h-16 ${currentTheme.icon}`} />,
          text: "Place your finger on the scanner",
        };
      default:
        return null;
    }
  };

  const getAuthMethodBadge = (method: string) => {
    const colors = {
      face: "bg-blue-100 text-blue-800",
      rfid: "bg-green-100 text-green-800",
      fingerprint: "bg-amber-100 text-amber-800",
    };
    return colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                IoT Lab Security
              </h1>
              <p className="text-sm text-gray-500">Access Control System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const theme = getThemeColors(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? `${theme.active} border`
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div
                      className={`w-2 h-2 ${theme.dot} rounded-full ml-auto animate-pulse`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">© 2025 IoT Lab Security</p>
          <p className="text-xs text-gray-400">System Online</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div
          className={`bg-white border-b border-gray-200 px-8 py-6 transition-all duration-300 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {activeTab === "users" && (
                <div
                  className={`w-10 h-10 ${
                    currentTheme.bg
                  } rounded-lg flex items-center justify-center transform transition-all duration-300 ${
                    isTransitioning
                      ? "scale-95 rotate-12"
                      : "scale-100 rotate-0"
                  }`}
                >
                  <Users className={`w-6 h-6 ${currentTheme.icon}`} />
                </div>
              )}
              <div>
                <h1
                  className={`text-2xl font-semibold text-gray-900 transition-all duration-300 ${
                    isTransitioning
                      ? "translate-x-2 opacity-70"
                      : "translate-x-0 opacity-100"
                  }`}
                >
                  {getTabTitle()}
                </h1>
                <p
                  className={`text-gray-500 mt-1 transition-all duration-300 delay-75 ${
                    isTransitioning
                      ? "translate-x-2 opacity-70"
                      : "translate-x-0 opacity-100"
                  }`}
                >
                  {getTabSubtitle()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Active</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`flex-1 p-8 transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          {activeTab === "users" ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transform transition-all duration-500 hover:shadow-lg">
              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, ID, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        ID Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Authentication Methods
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-all duration-200 hover:scale-[1.005] hover:shadow-sm"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.idNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {user.authMethods.map((method) => (
                              <span
                                key={method}
                                className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getAuthMethodBadge(
                                  method
                                )} transform transition-all duration-200 hover:scale-110`}
                              >
                                {method === "face"
                                  ? "Face ID"
                                  : method === "rfid"
                                  ? "RFID"
                                  : "Fingerprint"}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.registeredAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transform transition-all duration-500 hover:shadow-lg">
                {/* Registration Header */}
                <div
                  className={`${currentTheme.bg} ${currentTheme.border} border-b p-6`}
                >
                  <div className="flex items-center space-x-3">
                    {activeTab === "face" && (
                      <Eye
                        className={`w-6 h-6 ${
                          currentTheme.icon
                        } transform transition-all duration-300 ${
                          isTransitioning
                            ? "rotate-12 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      />
                    )}
                    {activeTab === "rfid" && (
                      <CreditCard
                        className={`w-6 h-6 ${
                          currentTheme.icon
                        } transform transition-all duration-300 ${
                          isTransitioning
                            ? "rotate-12 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      />
                    )}
                    {activeTab === "fingerprint" && (
                      <Fingerprint
                        className={`w-6 h-6 ${
                          currentTheme.icon
                        } transform transition-all duration-300 ${
                          isTransitioning
                            ? "rotate-12 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      />
                    )}
                    <h2
                      className={`text-xl font-semibold ${currentTheme.text}`}
                    >
                      {activeTab === "face" && "Face ID Registration"}
                      {activeTab === "rfid" && "RFID Registration"}
                      {activeTab === "fingerprint" &&
                        "Fingerprint Registration"}
                    </h2>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Number
                        </label>
                        <input
                          type="text"
                          value={formData.idNumber}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              idNumber: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                          placeholder="Enter ID number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <div className="relative">
                          <select
                            value={formData.role}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                role: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white focus:scale-[1.01]"
                          >
                            <option value="Student">Student</option>
                            <option value="Lecturer">Lecturer</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Scanner Section */}
                    <div className="flex flex-col">
                      <div
                        className={`flex-1 border-2 border-dashed ${currentTheme.scanner} rounded-xl flex flex-col items-center justify-center p-8 min-h-[300px] transform transition-all duration-300 hover:scale-[1.02]`}
                      >
                        {loading === activeTab ? (
                          <div className="text-center">
                            <div
                              className={`w-16 h-16 border-4 ${currentTheme.icon.replace(
                                "text-",
                                "border-"
                              )} border-t-transparent rounded-full animate-spin mb-4`}
                            ></div>
                            <p
                              className={`${currentTheme.scannerText} font-medium`}
                            >
                              Scanning...
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="transform transition-all duration-300 hover:scale-110">
                              {getScannerContent()?.icon}
                            </div>
                            <p
                              className={`${currentTheme.scannerText} font-medium mt-4`}
                            >
                              {getScannerContent()?.text}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          handleRegister(
                            activeTab as "face" | "rfid" | "fingerprint"
                          )
                        }
                        disabled={loading !== null}
                        className={`w-full mt-6 ${currentTheme.button} disabled:opacity-50 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed hover:shadow-lg`}
                      >
                        {loading === activeTab
                          ? "Registering..."
                          : `Register ${getTabTitle()}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100 animate-slideUp">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number
                </label>
                <input
                  type="text"
                  value={editingUser.idNumber}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, idNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Authentication Methods
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={editingUser.authMethods.includes("face")}
                      onChange={() => handleAuthMethodToggle("face")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                    />
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Face ID
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={editingUser.authMethods.includes("rfid")}
                      onChange={() => handleAuthMethodToggle("rfid")}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-all duration-200"
                    />
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        RFID
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={editingUser.authMethods.includes("fingerprint")}
                      onChange={() => handleAuthMethodToggle("fingerprint")}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 transition-all duration-200"
                    />
                    <div className="flex items-center space-x-2">
                      <Fingerprint className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Fingerprint
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
