import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const NoteForm = ({ note = null, onSubmit, onCancel, loading = false }) => {
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(note?.color || '#ffffff');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
      isPinned: note?.isPinned || false,
    },
  });

  const content = watch('content');

  // Update word count
  useEffect(() => {
    const wordCount = content ? content.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
    setValue('wordCount', wordCount);
  }, [content, setValue]);

  const colors = [
    '#ffffff', '#fef3c7', '#d1fae5', '#dbeafe', '#f3e8ff',
    '#fecaca', '#fed7aa', '#fde68a', '#a7f3d0', '#bfdbfe'
  ];

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      tags,
      color: selectedColor,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Note title..."
            className="w-full text-2xl font-semibold border-none outline-none bg-transparent"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Start writing your note..."
            rows={10}
            className="w-full border-none outline-none bg-transparent resize-none text-gray-700"
            {...register('content', { required: 'Content is required' })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPinned"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('isPinned')}
            />
            <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700">
              Pin this note
            </label>
          </div>

          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {note ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
