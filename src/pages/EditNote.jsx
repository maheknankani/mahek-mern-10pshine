import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notesAPI } from '../services/api';
import NoteForm from '../components/NoteForm';
import toast from 'react-hot-toast';

const EditNote = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (noteData) => {
    try {
      setSubmitting(true);
      const response = await notesAPI.updateNote(id, noteData);
      toast.success('Note updated successfully!');
      navigate(`/note/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/note/${id}`);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
        <p className="text-gray-600 mt-1">Update your note content and settings</p>
      </div>
      
      <NoteForm
        note={note}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitting}
      />
    </div>
  );
};

export default EditNote;
