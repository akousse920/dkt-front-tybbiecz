import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Shield, Calendar, Mail, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const { data } = await response.json();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Profile not found</h3>
          <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 sm:px-10">
            <div className="flex flex-col items-center">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-indigo-600" />
                  </div>
                )}
                {profile.roles.includes('admin') && (
                  <span className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1 shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </span>
                )}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">{profile.name}</h2>
              <div className="mt-2 flex items-center space-x-2">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-indigo-800 capitalize"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6 sm:px-10">
            <dl className="space-y-6">
              <div className="flex items-center">
                <dt className="flex items-center text-sm font-medium text-gray-500 w-24">
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                </dt>
                <dd className="text-sm text-gray-900">{profile.email}</dd>
              </div>

              <div className="flex items-center">
                <dt className="flex items-center text-sm font-medium text-gray-500 w-24">
                  <Calendar className="h-5 w-5 mr-2" />
                  Joined
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;