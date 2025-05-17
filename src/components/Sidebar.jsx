import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'uec', label: 'PRD转UEC模型', icon: 'document-text' },
    { id: 'flow', label: '生成流程图', icon: 'flow-chart' },
    { id: 'summary', label: '需求简洁描述', icon: 'text-summary' },
    { id: 'collaborate', label: '团队协作与反馈', icon: 'team' },
  ];

  // 处理菜单项点击
  const handleMenuItemClick = (itemId) => {
    console.log('点击菜单项:', itemId);
    setActiveTab(itemId);
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* 插件标题 */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">需求解读器</h1>
      </div>

      {/* 菜单项 */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                      {/* 简化的图标表示 */}
                      <rect width="20" height="20" rx="4" fill={isActive ? "#3B82F6" : "#E5E7EB"} />
                      <text x="10" y="14" fontSize="10" textAnchor="middle" fill={isActive ? "#FFFFFF" : "#4B5563"}>
                        {item.icon.charAt(0).toUpperCase()}
                      </text>
                    </svg>
                  </span>
                  <span className={isActive ? 'text-white font-medium' : ''}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>需求解读器 v1.0.0</p>
          <p className="mt-1">帮助团队更好地理解需求</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
