import Note from '../modules/Note.js';
import logger from '../utiles/logger.js';


export const getNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tag, isPinned, isArchived } = req.query;
    const userId = req.user.id;


    const query = { author: userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (isPinned !== undefined) {
      query.isPinned = isPinned === 'true';
    }
    
    if (isArchived !== undefined) {
      query.isArchived = isArchived === 'true';
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, lastModified: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name email');

    const total = await Note.countDocuments(query);

    logger.info('Notes retrieved', {
      userId,
      count: notes.length,
      page,
      limit,
    });

    res.json({
      success: true,
      data: {
        notes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    logger.error('Get notes error:', error);
    next(error);
  }
};


export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).populate('author', 'name email');
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

   
    if (note.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this note',
      });
    }

    logger.info('Note retrieved', {
      userId: req.user.id,
      noteId: note._id,
    });

    res.json({
      success: true,
      data: { note },
    });
  } catch (error) {
    logger.error('Get note error:', error);
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;
    const userId = req.user.id;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      color: color || '#ffffff',
      isPinned: isPinned || false,
      author: userId,
    });

    await note.populate('author', 'name email');

    logger.info('Note created', {
      userId,
      noteId: note._id,
      title: note.title,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note },
    });
  } catch (error) {
    logger.error('Create note error:', error);
    next(error);
  }
};


export const updateNote = async (req, res, next) => {
  try {
    const { title, content, tags, color, isPinned, isArchived } = req.body;
    const noteId = req.params.id;
    const userId = req.user.id;

    let note = await Note.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

  
    if (note.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note',
      });
    }

    
    note = await Note.findByIdAndUpdate(
      noteId,
      {
        title,
        content,
        tags: tags || note.tags,
        color: color || note.color,
        isPinned: isPinned !== undefined ? isPinned : note.isPinned,
        isArchived: isArchived !== undefined ? isArchived : note.isArchived,
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    logger.info('Note updated', {
      userId,
      noteId: note._id,
      title: note.title,
    });

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: { note },
    });
  } catch (error) {
    logger.error('Update note error:', error);
    next(error);
  }
};


export const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    
    if (note.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note',
      });
    }

    await Note.findByIdAndDelete(noteId);

    logger.info('Note deleted', {
      userId,
      noteId,
      title: note.title,
    });

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    logger.error('Delete note error:', error);
    next(error);
  }
};


export const togglePin = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (note.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this note',
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    logger.info('Note pin toggled', {
      userId,
      noteId,
      isPinned: note.isPinned,
    });

    res.json({
      success: true,
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: { note },
    });
  } catch (error) {
    logger.error('Toggle pin error:', error);
    next(error);
  }
};


export const toggleArchive = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findById(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

   
    if (note.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this note',
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    logger.info('Note archive toggled', {
      userId,
      noteId,
      isArchived: note.isArchived,
    });

    res.json({
      success: true,
      message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`,
      data: { note },
    });
  } catch (error) {
    logger.error('Toggle archive error:', error);
    next(error);
  }
};

