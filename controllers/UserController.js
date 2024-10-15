import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'


// get a user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("no such user exists");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// update a user

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10)

                req.body.password = await bcrypt.hash(password, salt)
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true })

            res.status(200).json(user)

        } catch (error) {
            res.status(500).json(error);
        }

    } else {
        res.status(403).json('Access denied you can only update your profile')
    }


}

// Delete user

export const deleteUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserAdminStatus } = req.body

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json('user deleted successfully!')
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json('Access denied you can only delete your profile')
    }
}


// follow a User


export const followUser = async (req, res) => {
    const id = req.params.id; // The ID of the user to be followed
    const { currentUserId } = req.body; // The ID of the current logged-in user

    // Check if the user is trying to follow themselves
    if (currentUserId === id) {
        return res.status(403).json("Action forbidden");
    } else {
        try {
            // Fetch the user to be followed and the current user from the database
            const userToFollow = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            // Check if the current user is already following the user
            if (!userToFollow.followers.includes(currentUserId)) {
                // Add the current user to the followers list of the user to be followed
                await userToFollow.updateOne({ $push: { followers: currentUserId } });
                // Add the user to be followed to the following list of the current user
                await followingUser.updateOne({ $push: { following: id } });

                res.status(200).json("User followed!");
            } else {
                res.status(403).json("User is already followed by you");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
 

// unfollow

export const unfollowUser = async (req, res) => {
    const id = req.params.id; // The ID of the user to be followed
    const { currentUserId } = req.body; // The ID of the current logged-in user

    // Check if the user is trying to follow themselves
    if (currentUserId === id) {
        return res.status(403).json("Action forbidden");
    } else {
        try {
            // Fetch the user to be followed and the current user from the database
            const userToFollow = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserId);

            // Check if the current user is already following the user
            if (!userToFollow.followers.includes(currentUserId)) {
                // Add the current user to the followers list of the user to be followed
                await userToFollow.updateOne({ $pull: { followers: currentUserId } });
                // Add the user to be followed to the following list of the current user
                await followingUser.updateOne({ $pull: { following: id } });

                res.status(200).json("User Unfollowed!");
            } else {
                res.status(403).json("User is not followed by you");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};