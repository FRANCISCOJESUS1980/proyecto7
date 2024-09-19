const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'El contenido del comentario es obligatorio'],
      trim: true,
      maxlength: [500, 'El comentario no puede exceder los 500 caracteres']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    }
  },
  { timestamps: true }
)

commentSchema.index({ user: 1 })
commentSchema.index({ post: 1 })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
