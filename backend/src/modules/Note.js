import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Note author is required'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#ffffff',
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color code',
    },
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});


noteSchema.pre('save', function(next) {
  if (this.isModified('content')) {
   
    this.wordCount = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    this.lastModified = new Date();
  }
  next();
});


noteSchema.index({ author: 1, createdAt: -1 });
noteSchema.index({ author: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ author: 1, isArchived: 1 });

export default mongoose.model('Note', noteSchema);

