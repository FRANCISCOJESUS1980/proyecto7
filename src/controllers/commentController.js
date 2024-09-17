const Comment = require('../models/Comment')

const createComment = async (req, res) => {
  const { content, postId } = req.body

  try {
    const comment = new Comment({
      content,
      user: req.user._id,
      post: postId
    })

    await comment.save()
    res.status(201).json(comment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username') // Traer información del autor
      .populate('post', 'title') // Traer información del post
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateComment = async (req, res) => {
  const { content } = req.body

  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    comment.content = content
    await comment.save()
    res.json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    await comment.remove()
    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
}
