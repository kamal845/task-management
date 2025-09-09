import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { User, Mail, Lock, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { isValidName, isValidEmail, isValidPassword, getPasswordStrength } from '../../utils/validation';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  // Password form
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data) => updateProfile(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update profile');
      }
    }
  );

  // Update password mutation
  const updatePasswordMutation = useMutation(
    (data) => updatePassword(data),
    {
      onSuccess: () => {
        passwordForm.reset();
        toast.success('Password updated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update password');
      }
    }
  );

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  const newPassword = passwordForm.watch('newPassword', '');
  const passwordStrength = getPasswordStrength(newPassword);

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    error={!!profileForm.formState.errors.name}
                    errorMessage={profileForm.formState.errors.name?.message}
                    {...profileForm.register('name', {
                      required: 'Name is required',
                      validate: (value) => isValidName(value) || 'Name can only contain letters and spaces'
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    error={!!profileForm.formState.errors.email}
                    errorMessage={profileForm.formState.errors.email?.message}
                    {...profileForm.register('email', {
                      required: 'Email is required',
                      validate: (value) => isValidEmail(value) || 'Please enter a valid email'
                    })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Account Information
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Role: <span className="font-medium capitalize">{user?.role}</span></p>
                      <p>Member since: <span className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</span></p>
                      {user?.lastLogin && (
                        <p>Last login: <span className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={updateProfileMutation.isLoading}
                  disabled={updateProfileMutation.isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    error={!!passwordForm.formState.errors.currentPassword}
                    errorMessage={passwordForm.formState.errors.currentPassword?.message}
                    {...passwordForm.register('currentPassword', {
                      required: 'Current password is required'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    error={!!passwordForm.formState.errors.newPassword}
                    errorMessage={passwordForm.formState.errors.newPassword?.message}
                    {...passwordForm.register('newPassword', {
                      required: 'New password is required',
                      validate: (value) => isValidPassword(value) || 'Password must contain at least 6 characters with uppercase, lowercase, and number'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-600' :
                        passwordStrength.score <= 3 ? 'text-orange-600' :
                        passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    error={!!passwordForm.formState.errors.confirmPassword}
                    errorMessage={passwordForm.formState.errors.confirmPassword?.message}
                    {...passwordForm.register('confirmPassword', {
                      required: 'Please confirm your new password'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Password Requirements
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>At least 6 characters long</li>
                        <li>Contains at least one uppercase letter</li>
                        <li>Contains at least one lowercase letter</li>
                        <li>Contains at least one number</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={updatePasswordMutation.isLoading}
                  disabled={updatePasswordMutation.isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
