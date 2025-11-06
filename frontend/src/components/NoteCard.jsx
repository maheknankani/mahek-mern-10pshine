import { Link } from 'react-router-dom';
import { Pin, Archive, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const handleTogglePin = async (e) => {
    e.preventDefault();
    try {
      const response = await notesAPI.togglePin(note._id);
      onUpdate(response.data.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle pin');
    }
  };

  const handleToggleArchive = async (e) => {
    e.preventDefault();
    try {
      const response = await notesAPI.toggleArchive(note._id);
      onUpdate(response.data.data.note);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle archive');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(note._id);
        onDelete(note._id);
        toast.success('Note deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete note');
      }
    }
  };

  const getWordCount = (content) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div 
      className="floating-card hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-scale-in"
      style={{ backgroundColor: note.color || 'rgba(255, 255, 255, 0.95)' }}
    >
      <Link to={`/note/${note._id}`} className="block p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-dark-800 line-clamp-2">
            {note.title}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            {note.isPinned && (
              <Pin className="h-4 w-4 text-accent-500 fill-current" />
            )}
            {note.isArchived && (
              <Archive className="h-4 w-4 text-primary-500" />
            )}
          </div>
        </div>
        
        <p className="text-dark-600 text-sm line-clamp-3 mb-4">
          {note.content}
        </p>
        
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-dark-500">
          <span>{formatDistanceToNow(new Date(note.lastModified), { addSuffix: true })}</span>
          <span>{getWordCount(note.content)} words</span>
        </div>
      </Link>
      
      <div className="flex items-center justify-end space-x-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <button
          onClick={handleTogglePin}
          className={`p-2 rounded-full transition-all duration-300 ${
            note.isPinned
              ? 'text-accent-600 hover:bg-accent-100 transform hover:scale-110'
              : 'text-gray-400 hover:text-accent-600 hover:bg-accent-50 transform hover:scale-110'
          }`}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleToggleArchive}
          className={`p-2 rounded-full transition-all duration-300 ${
            note.isArchived
              ? 'text-primary-600 hover:bg-primary-100 transform hover:scale-110'
              : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50 transform hover:scale-110'
          }`}
          title={note.isArchived ? 'Unarchive note' : 'Archive note'}
        >
          <Archive className="h-4 w-4" />
        </button>
        
        <Link
          to={`/edit/${note._id}`}
          className="p-2 text-gray-400 hover:text-dark-600 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-110"
          title="Edit note"
        >
          <Edit className="h-4 w-4" />
        </Link>
        
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 transform hover:scale-110"
          title="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
