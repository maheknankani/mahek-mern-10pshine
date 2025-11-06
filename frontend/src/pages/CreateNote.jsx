import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';
import NoteForm from '../components/NoteForm';
import toast from 'react-hot-toast';

const CreateNote = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (noteData) => {
    try {
      setLoading(true);
      const response = await notesAPI.createNote(noteData);
      toast.success('Note created successfully!');
      navigate(`/note/${response.data.data.note._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
        <p className="text-gray-600 mt-1">Start writing your thoughts and ideas</p>
      </div>
      
      <NoteForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default CreateNote;
