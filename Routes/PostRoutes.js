import express from "express"
import { createPost,deletePost,getPost,likePost,updatePost } from '../controllers/PostController.js'

const router = express.Router()


router.post('/', createPost)
router.get('/:id',getPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like',likePost)

export default router;