import React from 'react';

const ProfileCard = ({
  profileData,
  isEditing,
  onFileSelect,
  onProfileChange,
  onSave,
  onCancel,
  saveLoading
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 relative overflow-hidden">
      {/* 裝飾性背景元素 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-bl-full opacity-50 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-start relative">
        {/* 頭像區域 */}
        <div className="relative mb-6 md:mb-0 md:mr-8 group">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
            <img
              src={profileData.avatar}
              alt="頭像"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow-lg cursor-pointer transform hover:scale-105">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileSelect(e, 'avatar')}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          )}
        </div>

        {/* 個人資訊區域 */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => onProfileChange('displayName', e.target.value)}
                  className="text-2xl font-bold bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 border-2 border-transparent focus:border-blue-500 focus:outline-none transition"
                  placeholder="你的名字"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileData.displayName || '未設定名稱'}
                </h2>
              )}
              <div className="flex items-center mt-2 space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {profileData.email}
                </p>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => onProfileChange('location', e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 text-sm border-2 border-transparent focus:border-blue-500 focus:outline-none transition"
                    placeholder="你的所在地"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {profileData.location || '未設定所在地'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 bg-gray-500 text-white hover:bg-gray-600 shadow-lg"
                  >
                    取消
                  </button>
                  <button
                    onClick={onSave}
                    className="px-6 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        儲存中...
                      </span>
                    ) : '儲存變更'}
                  </button>
                </>
              ) : (
                <button
                  onClick={onSave}
                  className="px-6 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  編輯資料
                </button>
              )}
            </div>
          </div>

          {/* 個人簡介 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">個人簡介</h3>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => onProfileChange('bio', e.target.value)}
                className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-gray-700 dark:text-gray-300 border-2 border-transparent focus:border-blue-500 focus:outline-none transition resize-none"
                placeholder="寫下你的個人簡介..."
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                {profileData.bio || '尚未填寫個人簡介'}
              </p>
            )}
          </div>

          {/* 個人網站 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">個人網站</h3>
            {isEditing ? (
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => onProfileChange('website', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 border-2 border-transparent focus:border-blue-500 focus:outline-none transition"
                placeholder="你的個人網站連結"
              />
            ) : profileData.website ? (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:rotate-45 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                {profileData.website}
              </a>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">尚未設定個人網站</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 