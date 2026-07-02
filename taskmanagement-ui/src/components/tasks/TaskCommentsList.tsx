import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskCommentService, type CreateTaskCommentRequest, type TaskCommentResponse } from '../../services/TaskCommentService';
import { formatVietnamTime } from '../../utils/dateUtils';
import { Send, Trash2, MessageSquare, CornerDownRight, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const TaskCommentsList = ({ taskId, currentUsername }: { taskId: number, currentUsername: string }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: () => TaskCommentService.getComments(taskId),
  });

  const comments = response?.data?.data || [];

  const addCommentMutation = useMutation({
    mutationFn: (request: CreateTaskCommentRequest) => TaskCommentService.addComment(taskId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      setNewComment('');
      setReplyContent('');
      setReplyingToId(null);
    },
    onError: () => toast.error('Failed to post comment')
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => TaskCommentService.deleteComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      toast.success('Comment deleted');
    },
    onError: () => toast.error('Failed to delete comment')
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      TaskCommentService.updateComment(taskId, commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
      setEditingCommentId(null);
      setEditContent('');
      toast.success('Comment updated');
    },
    onError: () => toast.error('Failed to update comment')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment });
  };

  const handleReplySubmit = (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    addCommentMutation.mutate({ content: replyContent, parentId });
  };

  const startEditing = (comment: TaskCommentResponse) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const submitEdit = (commentId: number) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editContent });
  };

  const renderComment = (comment: TaskCommentResponse, isReply = false) => (
    <div key={comment.id} className={`flex gap-3 ${isReply ? 'mt-3 ml-8' : 'mt-4'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-sm">
        {comment.fullName?.charAt(0) || comment.username?.charAt(0) || ''}
      </div>
      <div className="flex-grow">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-surface-900 dark:text-surface-50">{comment.fullName || comment.username}</span>
            <span className="text-xs text-surface-400 dark:text-surface-500">
              {formatVietnamTime(comment.createdAt)}
            </span>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-surface-400 italic">(edited)</span>
            )}
          </div>

          {/* Content or Edit Input */}
          {editingCommentId === comment.id ? (
            <div className="mt-1">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full text-sm rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[60px]"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => submitEdit(comment.id)}
                  disabled={updateCommentMutation.isPending || !editContent.trim()}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Check className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-200"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* Actions */}
          {editingCommentId !== comment.id && (
            <div className="mt-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isReply && (
                <button
                  onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                  className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium"
                >
                  <CornerDownRight className="w-3 h-3" />
                  Reply
                </button>
              )}
              {comment.username === currentUsername && (
                <>
                  <button
                    onClick={() => startEditing(comment)}
                    className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 font-medium"
                    disabled={deleteCommentMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Reply Input */}
        {replyingToId === comment.id && !isReply && (
          <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-grow text-sm rounded-md border border-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              disabled={addCommentMutation.isPending || !replyContent.trim()}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reply
            </button>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-slate-100">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <div className="flex items-center gap-2 text-slate-800 font-semibold mb-4">
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        <h3>Discussion ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})</h3>
      </div>

      {/* Main Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6 relative">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
          {(currentUsername || '').charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment or mention @someone..."
            className="w-full text-sm rounded-lg border border-slate-200 px-4 py-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending || !newComment.trim()}
            className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center text-sm text-slate-500 py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-4 italic">No comments yet. Be the first to start the discussion!</div>
        ) : (
          comments.map(c => renderComment(c))
        )}
      </div>
    </div>
  );
};
