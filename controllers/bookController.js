const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const { category, available, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by availability
    if (available !== undefined) {
      query.available = available === 'true';
    }

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get total count
    const count = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: books,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(
        new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return next(
        new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(
        new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
      );
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
