// 引入必要的 React 相關函式庫和組件
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadImageToR2WithCompression } from '../../utils/imageUtils';
import { imageConfig } from '../../utils/r2Config';
import defaultAvatar from '../../assets/images/images.webp';

// 引入個人資料相關的子組件
import ProfileHeader from './ProfileHeader';
import ProfileCard from './ProfileCard';
import LoadingState from '../UI/LoadingState';
import SuccessMessage from '../UI/SuccessMessage';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    bio: '',
    location: '',
    website: '',
    avatar: currentUser?.photoURL || defaultAvatar,
    backgroundImage: ''
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  const [fileInputs, setFileInputs] = useState({
    avatar: null,
    backgroundImage: null
  });

  // 將 fetchUserProfile 移到 useEffect 外面
  const fetchUserProfile = async () => {
    if (!currentUser) return;

    try {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData(prev => ({
          ...prev,
          ...userData,
          displayName: currentUser.displayName || userData.displayName || '',
          avatar: currentUser.photoURL || userData.avatar || prev.avatar
        }));
      }
    } catch (error) {
      console.error('獲取用戶資料失敗:', error);
      setMessage({ type: 'error', content: '獲取資料失敗，請重新整理頁面' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setFileInputs(prev => ({
        ...prev,
        [type]: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          [type]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setSaveLoading(true);
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', currentUser.uid);

      let avatarUrl = profileData.avatar;
      let backgroundUrl = profileData.backgroundImage;

      if (fileInputs.avatar) {
        avatarUrl = await uploadImageToR2WithCompression(
          fileInputs.avatar,
          imageConfig.uploadPath.avatar,
          { maxSizeMB: 0.5, maxWidthOrHeight: 400 }
        );
      }
      
      if (fileInputs.backgroundImage) {
        backgroundUrl = await uploadImageToR2WithCompression(
          fileInputs.backgroundImage,
          imageConfig.uploadPath.post,
          { maxSizeMB: 1, maxWidthOrHeight: 1920 }
        );
      }

      await updateUserProfile({
        displayName: profileData.displayName,
        photoURL: avatarUrl
      });

      await setDoc(userRef, {
        displayName: profileData.displayName,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        avatar: avatarUrl,
        backgroundImage: backgroundUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage({ type: 'success', content: '個人資料已更新！' });
      setIsEditing(false);
      setFileInputs({
        avatar: null,
        backgroundImage: null
      });

      // 延遲 1 秒後重新整理頁面
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('更新失敗:', error);
      setMessage({ type: 'error', content: '更新失敗，請稍後再試' });
    }
    setSaveLoading(false);
  };

  // 處理取消編輯
  const handleCancel = async () => {
    // 重新載入原始資料
    await fetchUserProfile();
    // 重置檔案上傳狀態
    setFileInputs({
      avatar: null,
      backgroundImage: null
    });
    // 關閉編輯模式
    setIsEditing(false);
  };

  if (loading) {
    return (
      <LoadingState
        type="spinner"
        size="lg"
        text="載入中..."
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader
          backgroundImage={profileData.backgroundImage}
          isEditing={isEditing}
          onFileSelect={handleFileSelect}
        />

        <ProfileCard
          profileData={profileData}
          isEditing={isEditing}
          onFileSelect={handleFileSelect}
          onProfileChange={handleProfileChange}
          onSave={() => isEditing ? handleSave() : setIsEditing(true)}
          onCancel={handleCancel}
          saveLoading={saveLoading}
        />

        {message.content && (
          <SuccessMessage
            message={message.content}
            type={message.type}
            onClose={() => setMessage({ type: '', content: '' })}
            duration={3000}
          />
        )}
      </div>
    </div>
  );
};

export default Profile; 