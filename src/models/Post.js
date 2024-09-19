const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    content: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      trim: true,
      maxlength: [5000, 'El contenido no puede exceder los 5000 caracteres']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { timestamps: true }
)

postSchema.index({ user: 1 })
postSchema.index({ title: 1 })

postSchema.pre('remove', async function (next) {
  try {
    await mongoose.model('Comment').deleteMany({ post: this._id })
    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('Post', postSchema)
