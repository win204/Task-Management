import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Paperclip, Download, Trash2, Upload, File, Loader2 } from 'lucide-react';
import { AttachmentService, type AttachmentResponse } from '@/features/tasks/api/AttachmentService';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';

interface TaskAttachmentsListProps {
  taskId: number;
}

export const TaskAttachmentsList = ({ taskId }: TaskAttachmentsListProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: attachments, isLoading, isError } = useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: () => AttachmentService.getAttachmentsByTask(taskId),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => AttachmentService.uploadFile(taskId, file),
    onMutate: () => setIsUploading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('File uploaded successfully');
    },
    onError: () => toast.error('Failed to upload file'),
    onSettled: () => setIsUploading(false),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => AttachmentService.deleteAttachment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', taskId] });
      toast.success('Attachment deleted');
    },
    onError: () => toast.error('Failed to delete attachment'),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    uploadMutation.mutate(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Paperclip className="w-4 h-4" />
          Attachments ({attachments?.length || 0})
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt,.zip"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center text-sm text-slate-500 py-4">Loading attachments...</div>
        ) : isError ? (
          <div className="text-center text-sm text-red-500 py-4 italic bg-red-50 rounded border border-red-100">Failed to load attachments.</div>
        ) : attachments?.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-4 italic bg-white rounded border border-slate-100 border-dashed">No attachments yet.</div>
        ) : (
          attachments?.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <File className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-slate-900 truncate" title={attachment.fileName}>
                    {attachment.fileName}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-medium text-slate-600">{formatFileSize(attachment.fileSize)}</span>
                    <span className="text-slate-300">•</span>
                    <span>{attachment.fileType?.split('/').pop()?.toUpperCase() || 'FILE'}</span>
                    <span className="text-slate-300">•</span>
                    <span>by {attachment.uploadedByName || 'Unknown'}</span>
                    <span className="text-slate-300">•</span>
                    <span>{new Date(attachment.uploadedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => window.open(AttachmentService.getDownloadUrl(attachment.id), '_blank')}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                {user?.roles?.includes('ADMIN') && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this attachment?')) {
                        deleteMutation.mutate(attachment.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
