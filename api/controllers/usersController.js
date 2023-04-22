const bcrypt = require("bcrypt")

const User = require("../models/User")
const Token = require("../models/Token")

const register = async (req, res) => {
    try {
        const data = req.body;
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
        data["password"] = await bcrypt.hash(data["password"], salt);
        const result = await User.create(data);
        res.status(201).send(result);
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

const login = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.getOneByUsername(data.username);
        const authenticated = await bcrypt.compare(
            data.password,
            user["password"]
        );
        if (!authenticated) throw new Error("Incorrect credentials.")
        const token = await Token.create(user.id)
        res.status(200).json({ authenticated: true, token: token.token, isAdmin: user.isAdmin, user_id: user.id})
    } catch(err) {
        res.status(403).json({ error: err.message})
    }
}

const logout = async (req, res) => {
    try {
        const data = req.body;
        const token = await Token.getOneByToken(data.token)
        if (!token) throw new Error("Invalid token.")
        const result = await token.destroy()
        res.status(200).json(result)
    } catch(err) {
        res.status(403).json({ error: err.message})
    }
}

const getUsername = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) throw new Error("Invalid ID")
        const result = await User.getUser(parseInt(userId))
        res.status(200).send(result)
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

const getUserFromToken = async (req, res) => {
    try{
        const tokenId = req.params.id;
        const token = await Token.getOneById(tokenId);
        const user = await User.getOneByToken(tokenId);
        if (!token) throw new Error("Invalid token.")
        res.status(200).json(user)
    } catch(err) {
        res.status(403).json({error: err.message})
    }
}

const show = async (req, res) => {
    try {
        const UserId = req.params.id;
        const user = await User.getOneById(UserId);

        if (!user)  {
            return res.status(404).json({ error: 'User not found' });

          }
          return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
          }

    }

    const update = async (req, res) => {
        try {
          const id = parseInt(req.params.id)
          const data = req.body
          const user = await User.getOneById(id)
      
          if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
          }
      
          const result = await user.update(data)
          res.status(200).json(result)
        } catch(err) {
          res.status(404).json({ error: err.message })
        }
      }
      

const updateDetails = async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const data = req.body
        
        const user = await User.getOneById(id)
        const result = await user.updateDetails(data)
        res.status(200).json(result)
    } catch(err) {
        res.status(404).json({error: err.message})
    }
}

const updatePassword = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const user = await User.getOneById(id)
        const authenticated = await bcrypt.compare(
            data.oldPassword,
            user["password"]
        );
        if (!authenticated) throw new Error("Incorrect credentials.")
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
        data["newPassword"] = await bcrypt.hash(data["newPassword"], salt);
        const result = await user.updatePassword(data["newPassword"])
        res.status(200).json(result)
    } catch(err) {
        res.status(404).json({error: err.message})
    }
}

module.exports = {register, login, logout, getUsername, getUserFromToken, show, update, updateDetails, updatePassword}
