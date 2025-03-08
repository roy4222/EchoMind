/**
 * 聊天框組件
 * 作為聊天介面的主要容器
 */
import React from 'react';
import { motion } from 'framer-motion';

const ChatBox = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

export default ChatBox; 