const Post = require('../models/Post')

const createPost = async (req, res) => {
  const { title, content } = req.body

  const post = new Post({
    title,
    content,
    user: req.user._id
  })

  await post.save()
  res.status(201).json(post)
}

const getPosts = async (req, res) => {
  const posts = await Post.find().populate('user', 'username')
  res.json(posts)
}

const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    post.title = req.body.title || post.title
    post.content = req.body.content || post.content
    await post.save()
    res.json(post)
  } else {
    res.status(404).json({ message: 'Post no encontrado' })
  }
}

const deletePost = async (req, res) => {
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
}

module.exports = { createPost, getPosts, updatePost, deletePost }
