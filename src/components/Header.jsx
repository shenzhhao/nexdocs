import React, { useState } from 'react';

const Header = ({ onImportPrd }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [prdContent, setPrdContent] = useState('');
  
  // 处理导入PRD
  const handleImportPrd = () => {
    if (prdContent.trim() === '') return;
    
    onImportPrd(prdContent);
    setPrdContent('');
    setShowImportModal(false);
  };
  
  return (
    <>
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        {/* 左侧标题 */}
        <div className="flex items-center">
          <h2 className="text-base font-medium text-gray-900">需求解读器插件</h2>
        </div>
        
        {/* 右侧操作 */}
        <div className="flex items-center">
          <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => setShowImportModal(true)}
          >
            <span>导入PRD</span>
          </button>
        </div>
      </header>
      
      {/* 导入PRD模态框 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">导入PRD文档</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowImportModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="prdContent" className="block text-sm font-medium text-gray-700 mb-1">
                  PRD内容
                </label>
                <textarea
                  id="prdContent"
                  rows="10"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="粘贴PRD文档内容..."
                  value={prdContent}
                  onChange={(e) => setPrdContent(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowImportModal(false)}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleImportPrd}
                >
                  导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
