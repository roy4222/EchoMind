import React from 'react';

const ProfileHeader = ({ backgroundImage, isEditing, onFileSelect }) => {
  return (
    <div className="relative h-48 rounded-lg overflow-hidden mb-8">
      <img
        src={backgroundImage || 'https://images.unsplash.com/photo-1519681393784-d120267933ba'}
        alt="背景圖片"
        className="w-full h-full object-cover"
      />
      {isEditing && (
        <label className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileSelect(e, 'backgroundImage')}
          />
          更換背景
        </label>
      )}
    </div>
  );
};

export default ProfileHeader; 