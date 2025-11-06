import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pin, Archive, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

const ViewNote = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNote(id);
      setNote(response.data.data.note);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch note');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      const response = await notesAPI.togglePin(id);
      setNote(response.data.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle pin');
    }
  };

  const handleToggleArchive = async () => {
    try {
      const response = await notesAPI.toggleArchive(id);
      setNote(response.data.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle archive');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(id);
        toast.success('Note deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete note');
      }
    }
  };

  const getWordCount = (content) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h1>
          <p className="text-gray-600 mb-4">The note you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Notes
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded-lg transition-colors ${
              note.isPinned
                ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className={`h-5 w-5 ${note.isPinned ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleToggleArchive}
            className={`p-2 rounded-lg transition-colors ${
              note.isArchived
                ? 'text-primary-600 bg-primary-100 hover:bg-primary-200'
                : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
            }`}
            title={note.isArchived ? 'Unarchive note' : 'Archive note'}
          >
            <Archive className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit note"
          >
            <Edit className="h-5 w-5" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div 
        className="bg-white rounded-lg shadow-sm border p-8"
        style={{ backgroundColor: note.color || '#ffffff' }}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
            <div className="flex items-center space-x-2">
              {note.isPinned && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  <Pin className="h-3 w-3 mr-1 fill-current" />
                  Pinned
                </span>
              )}
              {note.isArchived && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
            <span>•</span>
            <span>Updated {formatDistanceToNow(new Date(note.lastModified), { addSuffix: true })}</span>
            <span>•</span>
            <span>{getWordCount(note.content)} words</span>
          </div>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;
