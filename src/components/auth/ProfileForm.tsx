'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Camera, User, Mail, Phone, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  avatar: string | null;
  emailVerified: string | null;
  createdAt: string;
}

interface ProfileFormProps {
  user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations('auth.profile');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
  });

  const [avatar, setAvatar] = useState(user.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setMessage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (formData.name && formData.name.length < 2) {
      newErrors.name = t('errors.name.minLength');
    }

    if (formData.phone && !/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = t('errors.phone.invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || undefined,
          phone: formData.phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.general') });
        return;
      }

      setMessage({ type: 'success', text: t('success.profileUpdated') });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: t('errors.general') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.avatarUpload') });
        return;
      }

      setAvatar(data.data.avatarUrl);
      setMessage({ type: 'success', text: t('success.avatarUpdated') });
    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage({ type: 'error', text: t('errors.avatarUpload') });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm(t('confirm.deleteAvatar'))) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.avatarDelete') });
        return;
      }

      setAvatar(null);
      setMessage({ type: 'success', text: t('success.avatarDeleted') });
    } catch (error) {
      console.error('Avatar delete error:', error);
      setMessage({ type: 'error', text: t('errors.avatarDelete') });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <Image
                src={avatar}
                alt="Avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        {avatar && (
          <button
            type="button"
            onClick={handleDeleteAvatar}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            {t('removeAvatar')}
          </button>
        )}
        <p className="text-sm text-gray-500">{t('avatarHint')}</p>
      </div>

      {/* Email (read-only) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('fields.email.label')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
        <p className="text-sm text-gray-500">
          {user.emailVerified ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t('emailVerified')}
            </span>
          ) : (
            <span className="text-yellow-600">{t('emailNotVerified')}</span>
          )}
        </p>
      </div>

      {/* Name field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('fields.name.label')}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('fields.name.placeholder')}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Phone field */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          {t('fields.phone.label')}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('fields.phone.placeholder')}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        <p className="text-xs text-gray-500">{t('fields.phone.hint')}</p>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('submit.loading')}
          </>
        ) : (
          t('submit.button')
        )}
      </button>
    </form>
  );
}
