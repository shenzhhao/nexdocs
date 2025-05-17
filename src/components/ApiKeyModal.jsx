import React, { useState } from 'react';
import { setApiKey } from '../services/aiService';

const ApiKeyModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKeyValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      setError('请输入API密钥');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const success = setApiKey(apiKey.trim());
      if (success) {
        onClose();
        // 保存到localStorage，方便下次使用
        localStorage.setItem('apiKey', apiKey.trim());
      } else {
        setError('设置API密钥失败');
      }
    } catch (error) {
      console.error('设置API密钥错误:', error);
      setError(error.message || '设置API密钥失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] max-w-full">
        <h2 className="text-xl font-semibold mb-4">设置API密钥</h2>

        <p className="text-gray-600 mb-4">
          请输入您的API密钥，用于调用AI服务。您可以使用Friday或KIMI的API密钥。
        </p>

        <div className="mb-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKeyValue(e.target.value)}
            placeholder="请输入API密钥"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '提交中...' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;