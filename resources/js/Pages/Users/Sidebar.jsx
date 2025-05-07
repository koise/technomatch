import { useState } from 'react';
import { 
  User, 
  Users, 
  UserPlus, 
  Bell, 
  Moon, 
  Sun, 
  Search,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for demonstration
const currentUser = {
  id: 1,
  name: "Alex Johnson",
  avatar: "/api/placeholder/100/100",
  status: "online"
};

const mockFriends = [
  { id: 2, name: "Jamie Smith", avatar: "/api/placeholder/100/100", status: "online" },
  { id: 3, name: "Taylor Roberts", avatar: "/api/placeholder/100/100", status: "idle" },
  { id: 4, name: "Morgan Lee", avatar: "/api/placeholder/100/100", status: "offline" },
  { id: 5, name: "Casey Williams", avatar: "/api/placeholder/100/100", status: "online" },
  { id: 6, name: "Riley Chen", avatar: "/api/placeholder/100/100", status: "offline" }
];

const friendRequests = [
  { id: 7, name: "Jordan Kim", avatar: "/api/placeholder/100/100" },
  { id: 8, name: "Quinn Davis", avatar: "/api/placeholder/100/100" }
];

// Status indicator component
const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    offline: "bg-gray-400"
  };

  return (
    <span className={`absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white ${statusColors[status]}`}></span>
  );
};

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleCollapse = () => setCollapsed(!collapsed);
  
  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-gray-200" : "text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const hoverColor = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  
  return (
    <div className={`flex h-screen ${bgColor} ${textColor} transition-all duration-300`}>
      <motion.div 
        className={`${collapsed ? 'w-20' : 'w-64'} border-r ${borderColor} flex flex-col transition-all duration-300`}
        layout
      >
        {/* Header with user info */}
        <div className={`p-4 flex items-center justify-between border-b ${borderColor}`}>
          <div className="flex items-center">
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt="User" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <StatusIndicator status={currentUser.status} />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.status}</p>
              </div>
            )}
          </div>
          <button 
            onClick={toggleCollapse}
            className={`p-2 rounded-full ${hoverColor}`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Search bar */}
        <div className={`px-3 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <button className={`p-2 rounded-full ${hoverColor}`}>
              <Search size={20} />
            </button>
          ) : (
            <div className={`flex items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className={`ml-2 bg-transparent outline-none w-full text-sm ${textColor}`}
              />
            </div>
          )}
        </div>
        
        {/* Navigation tabs */}
        <div className={`flex ${collapsed ? 'flex-col items-center' : 'justify-around'} p-2 border-b ${borderColor}`}>
          <button 
            className={`p-2 rounded-md ${activeTab === 'friends' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''} ${hoverColor}`}
            onClick={() => setActiveTab('friends')}
          >
            <Users size={collapsed ? 20 : 16} className={activeTab === 'friends' ? 'text-blue-500' : ''} />
            {!collapsed && <span className="ml-2 text-sm">Friends</span>}
          </button>
          <button 
            className={`p-2 rounded-md ${activeTab === 'add' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''} ${hoverColor}`}
            onClick={() => setActiveTab('add')}
          >
            <UserPlus size={collapsed ? 20 : 16} className={activeTab === 'add' ? 'text-blue-500' : ''} />
            {!collapsed && <span className="ml-2 text-sm">Add Friend</span>}
          </button>
          <button 
            className={`p-2 rounded-md ${activeTab === 'requests' ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : ''} ${hoverColor} relative`}
            onClick={() => setActiveTab('requests')}
          >
            <Bell size={collapsed ? 20 : 16} className={activeTab === 'requests' ? 'text-blue-500' : ''} />
            {friendRequests.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
            {!collapsed && <span className="ml-2 text-sm">Requests</span>}
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'friends' && (
            <div className="p-2">
              {!collapsed && <h3 className="text-sm font-semibold mb-2">Online Friends</h3>}
              <div className="space-y-2">
                {mockFriends.map(friend => (
                  <motion.div 
                    key={friend.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-2 rounded-lg ${hoverColor} cursor-pointer`}
                  >
                    <div className="relative">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <StatusIndicator status={friend.status} />
                    </div>
                    {!collapsed && (
                      <div className="ml-3">
                        <p className="font-medium text-sm">{friend.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{friend.status}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'add' && (
            <div className="p-4">
              {!collapsed && (
                <>
                  <h3 className="text-sm font-semibold mb-2">Add a Friend</h3>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-sm mb-3">Enter a username to send a friend request</p>
                    <input 
                      type="text" 
                      placeholder="Username" 
                      className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'} mb-2`}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm w-full">
                      Send Request
                    </button>
                  </div>
                </>
              )}
              {collapsed && (
                <div className="flex justify-center">
                  <UserPlus size={24} className="text-blue-500" />
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'requests' && (
            <div className="p-2">
              {!collapsed && <h3 className="text-sm font-semibold mb-2">Friend Requests</h3>}
              {friendRequests.length > 0 ? (
                <div className="space-y-2">
                  {friendRequests.map(request => (
                    <motion.div 
                      key={request.id}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                    >
                      <div className="flex items-center">
                        <img 
                          src={request.avatar} 
                          alt={request.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        {!collapsed && (
                          <p className="ml-3 font-medium text-sm">{request.name}</p>
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex space-x-2">
                          <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                            Accept
                          </button>
                          <button className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} px-2 py-1 rounded text-xs`}>
                            Decline
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {!collapsed ? 'No pending requests' : <Bell size={24} />}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className={`p-2 border-t ${borderColor} flex ${collapsed ? 'flex-col items-center' : 'justify-between'}`}>
          <button onClick={toggleDarkMode} className={`p-2 rounded-full ${hoverColor}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {!collapsed && (
            <div className="flex space-x-2">
              <Settings size={20} className={hoverColor} />
              <MessageSquare size={20} className={hoverColor} />
              <LogOut size={20} className={hoverColor} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
