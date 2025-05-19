import React, { useState } from 'react';

const CollaborationPage = ({ prdContent, onReset }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: '产品经理',
      avatar: '👨‍💼',
      content: '这个需求的优先级应该提高，对用户体验有很大提升。',
      timestamp: '2023-11-15 10:30',
      likes: 3
    },
    {
      id: 2,
      user: '设计师',
      avatar: '👩‍🎨',
      content: '流程图部分需要更加直观，我会提供一些设计建议。',
      timestamp: '2023-11-15 11:45',
      likes: 2
    },
    {
      id: 3,
      user: '开发工程师',
      avatar: '👨‍💻',
      content: '技术上可行，但需要考虑浏览器兼容性问题。',
      timestamp: '2023-11-15 14:20',
      likes: 1
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        user: '我',
        avatar: '👤',
        content: newComment,
        timestamp: new Date().toLocaleString(),
        likes: 0
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const handleLike = (id) => {
    setComments(
      comments.map(comment =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      )
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-xl font-semibold mb-6 text-white text-center">团队协作与反馈</h2>

      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-[15px] shadow-lg overflow-hidden">
        <div className="flex border-b border-white/10 mb-0">
          <button
            className={`px-4 py-3 text-sm ${activeTab === 'comments' ? 'border-b-2 border-purple-500 text-white' : 'text-white/60 hover:text-white/90'}`}
            onClick={() => setActiveTab('comments')}
          >
            评论 ({comments.length})
          </button>
          <button
            className={`px-4 py-3 text-sm ${activeTab === 'tasks' ? 'border-b-2 border-purple-500 text-white' : 'text-white/60 hover:text-white/90'}`}
            onClick={() => setActiveTab('tasks')}
          >
            任务
          </button>
        </div>

        {activeTab === 'comments' && (
          <>
            <div className="p-5">
              <div className="mb-4">
                <textarea
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-purple-500 text-white text-sm placeholder-white/40"
                  rows="3"
                  placeholder="添加评论..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    className="px-3 py-1.5 bg-gradient-to-r from-[#3E1B70] to-[#5F26B4] text-white text-sm rounded-[8px] hover:opacity-90 transition-opacity"
                    onClick={handleAddComment}
                  >
                    发送
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-white/5 border border-white/10 rounded-[10px] hover:bg-white/[0.07] transition-colors">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{comment.avatar}</span>
                      <span className="font-medium text-white text-sm">{comment.user}</span>
                      <span className="text-white/40 text-xs ml-auto">{comment.timestamp}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center text-white/40 text-xs">
                      <button
                        className="flex items-center hover:text-purple-400 transition-colors"
                        onClick={() => handleLike(comment.id)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.386-.54L4.25 14.5A2 2 0 014 13.05V4a2 2 0 012-2h3a2 2 0 012 2v6h3z"></path>
                        </svg>
                        <span>{comment.likes}</span>
                      </button>
                      <button className="flex items-center ml-4 hover:text-purple-400 transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>回复</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'tasks' && (
          <div className="p-5">
            <div className="p-3 bg-white/5 border border-white/10 rounded-[10px]">
              <p className="text-white/60 text-sm">任务功能正在开发中...</p>
            </div>
          </div>
        )}

        {/* Linear风格的底部分隔线和按钮区域 */}
        <div className="border-t border-white/10 p-4 bg-white/[0.03]">
          <div className="flex justify-center">
            <button
              onClick={onReset}
              className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-[8px] hover:bg-white/15 transition-colors"
            >
              重新上传
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;