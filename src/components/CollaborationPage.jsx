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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">团队协作与反馈</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === 'comments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('comments')}
          >
            评论 ({comments.length})
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('tasks')}
          >
            任务
          </button>
        </div>

        {activeTab === 'comments' && (
          <>
            <div className="mb-4">
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="添加评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleAddComment}
                >
                  发送
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{comment.avatar}</span>
                    <span className="font-medium">{comment.user}</span>
                    <span className="text-gray-500 text-sm ml-auto">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <button
                      className="flex items-center hover:text-blue-600"
                      onClick={() => handleLike(comment.id)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.386-.54L4.25 14.5A2 2 0 014 13.05V4a2 2 0 012-2h3a2 2 0 012 2v6h3z"></path>
                      </svg>
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center ml-4 hover:text-blue-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'tasks' && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">任务功能正在开发中...</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          重新上传
        </button>
      </div>
    </div>
  );
};

export default CollaborationPage;