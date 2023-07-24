const Message = require('../modal/messageModal');

module.exports.addMsg = async (req, res, next) => {
    try{
        const {from, to, msg} = req.body;
        const data = await Message.create({
            message: {text: msg},
            sender: from,
            users: [from, to]
        });
        if(data)
        {
            return res.json({msg: "Message send successfully."});
        }
        return res.json({msg: "Message send Failed."});
    }catch(e)
    {
        next(e);
    }
}
module.exports.getAllMsg = async (req, res, next) => {
    try{
        const {from, to} = req.body;
        const messages = await Message
        .find({
            users:{
                $all: [from, to],
            }
        }).sort({updatesAt: 1});
        const projectedMessages = messages.map((msg) => {
            return{
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        res.json(projectedMessages);
    }catch(e){

    }

}