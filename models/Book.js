const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author name'],
      trim: true,
      maxlength: [100, 'Author name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Self Help',
        'Fiction',
        'Non-Fiction',
        'Science',
        'Technology',
        'Biography',
        'History',
        'Philosophy',
        'Business',
        'Other',
      ],
    },
    available: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    publishYear: {
      type: Number,
      min: [1000, 'Please enter a valid year'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ category: 1 });

module.exports = mongoose.model('Book', bookSchema);
