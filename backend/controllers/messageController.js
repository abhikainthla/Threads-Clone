import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const sendMessage = async(req,res)=>{
    try {
        const {message,recipientId} = req.body;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, recipientId]},
        })
        if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}
            const newMessage = new Message({
                text: message,
                sender:senderId,
                conversationId: conversation._id
            })
            await Promise.all([ newMessage.save(),
                conversation.updateOne(
                    {lastMessages: {text: message, sender:senderId}}
                )
            ])
            res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("Error in sendMessage:", error.message)
        res.status(500).json({error: error.message})
    }
}
 
const getMessages = async(req,res)=>{
    const { otherUserId} = req.params;
    const userId = req.user._id;
    try {
        const conversation = await Conversation.findOne({
            participants:{ $all: [userId, otherUserId]}
        })
        if(!conversation){
            return res.status(404).json({error: "Conversation not found"})
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({createdAt: 1})

        res.status(200).json(messages);

     } catch (error) {
        console.log("Error in getMessage:", error.message)
        res.status(500).json({error: error.message})
    }
}

const getConversations = async(req,res)=>{
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({
            participants: userId
            }).populate({
                path: 'participants',
                select: "username profilePic"
            })

            conversations.forEach(conversations => {
                conversations.participants = conversations.participants.filter((participant) => participant._id.toString() !== userId.toString())
            })
            res.status(200).json(conversations);
        
    } catch (error) {
        console.log("Error in getConversations:", error.message)
        res.status(500).json({error: error.message}) 
    }
}

export {
    sendMessage,
    getMessages,
    getConversations
}