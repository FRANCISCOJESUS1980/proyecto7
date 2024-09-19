const Comment = require('../models/Comment')

const createComment = async (req, res) => {
  const { content, postId } = req.body

  if (!content || !postId) {
    return res
      .status(400)
      .json({ message: 'Contenido y ID del post son obligatorios' })
  }

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    const comment = new Comment({
      content,
      user: req.user._id,
      post: postId
    })

    await comment.save()

    res.status(201).json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .populate('post', 'title')

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: 'No hay comentarios para este post' })
    }

    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
const updateComment = async (req, res) => {
  const { content } = req.body

  // Validar el nuevo contenido
  if (!content || content.trim() === '') {
    return res
      .status(400)
      .json({ message: 'El contenido del comentario es obligatorio' })
  }

  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    if (comment.content === content) {
      return res
        .status(400)
        .json({ message: 'No se han realizado cambios en el comentario' })
    }

    comment.content = content
    await comment.save()

    res.json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    const isAdmin = req.user.role === 'admin'
    const isAuthor = comment.user.toString() === req.user._id.toString()

    if (!isAuthor && !isAdmin) {
      return res
        .status(401)
        .json({ message: 'No autorizado para eliminar el comentario' })
    }

    await comment.remove()

    res.json({ message: 'Comentario eliminado exitosamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
}
