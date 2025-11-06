import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, User, Mail, Calendar, LogOut, Settings, Shield, Activity } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="floating-card p-0 overflow-hidden max-h-[85vh]">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 p-6 text-white">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
             
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-shadow">
                  {user?.name || 'User'}
                </h2>
                <p className="text-white/80 text-sm">
                  {user?.email}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-2"></div>
                  <span className="text-xs text-white/70">Active</span>
                </div>
              </div>
            </div>
          </div>

         
          <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
            {/* User Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dark-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Profile Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-dark-800">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-dark-800">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Activity className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium text-dark-800">
                      {formatDate(user?.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dark-800 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary-600" />
                Account Status
              </h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                  <span className="font-medium text-dark-800">Account Status</span>
                </div>
                <span className="px-3 py-1 bg-accent-500 text-white text-xs font-medium rounded-full">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-dark-800">Account Settings</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
