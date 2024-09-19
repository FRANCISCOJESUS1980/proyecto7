const Post = require('../models/Post')

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: 'Título y contenido son obligatorios' })
    }

    const post = new Post({
      title,
      content,
      user: req.user._id
    })

    await post.save()

    res.status(201).json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username')
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id
    if (!postId) {
      return res.status(400).json({ message: 'ID del post es necesario' })
    }

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    post.title = req.body.title || post.title
    post.content = req.body.content || post.content
    await post.save()

    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (post) {
      if (post.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'No autorizado' })
      }

      await post.remove()
      res.json({ message: 'Post eliminado' })
    } else {
      res.status(404).json({ message: 'Post no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el post' })
  }
}

module.exports = { createPost, getPosts, updatePost, deletePost }
