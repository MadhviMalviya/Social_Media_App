import PostModel from "../Models/postModel.js";

// create new post

export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);

    try {
        await newPost.save()
        res.status(200).json('Post created')
    } catch (error) {
        res.status(500).json(error)

    }

}

// Get a post

export const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await PostModel.findById(id)

        res.status(200).json(post)

    } catch (error) {

        res.status(500).json(error)

    }
}

// update a post

export const updatePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await PostModel.findById(postId)

        if (post.userId === userId) {

            await post.updateOne({ $set: req.body })

            res.status(200).json("Post Updated")
        }

        else {
            res.status(403).json("Action forbidden")
        }

    } catch (error) {

        res.status(500).json(error)
    }

}


// Delete post

export const deletePost = async (req, res) => {
    const Id = req.params.id
    const { userId } = req.body

    try {
        const post = await PostModel.findById(Id)

        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("Post deleted")

        } else {
            res.status(403).json("Action forbidden")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}


// like/dislike a post

export const likePost = async (req, res) => {
    const Id = req.params.id;
    const { userId } = req.body;

    try {
       
        const post = await PostModel.findById(Id);

      
        if (!post) {
            return res.status(404).json("Post not found");
        }

        
        if (!post.likes.includes(userId)) {
            
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post liked");
        } else {
            res.status(403).json("You have already liked this post");
        }

    } catch (error) {
        
        res.status(500).json(error);
    }
};


// Get Timeline post

export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
   
    try {
    const currentUserPost=await PostModel.find({userId:userId})
    
} catch (error) {
    res.status(500).json(error)
}


    
};

