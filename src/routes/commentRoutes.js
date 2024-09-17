const express = require('express')
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} = require('../controllers/commentController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createComment)

router.get('/:postId', getCommentsByPost)

router.put('/:id', protect, updateComment)

router.delete('/:id', protect, deleteComment)

module.exports = router
