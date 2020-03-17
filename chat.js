var mongoose = require('mongoose');
const Message = require('./../models/message');
const Room = require('./../models/rooms');
var emoji = require('node-emoji')
const response = require('./../responses.js');


module.exports = {
    save_message,
};



function save_message(req,callback) {
    return new Promise (function (resolve, reject) {
         
        if (req.roomid != "") {

                    const emojiMessage1 = emoji.emojify(req.message);
                    const newMessage = new Message({
                    
                        _id: new mongoose.Types.ObjectId(),
                        sender: req.from,
                        receiver: req.to,
                        text: emojiMessage1,
                        roomid: req.roomid,        
                        senderName:req.senderName,
                        receiverName:req.receiverName
                        
                    });
                    if(req.image){
                        newMessage.image = req.image
                    }
        
                    newMessage.save(function (err, inserted) {
                        if (err) {
                          
                           
                            return callback(null,response.ERROR);
                        }
                        if (inserted) {
                           
                            var json_response = response.MESSAGE_ADDED
                            json_response.data = inserted
        
                            return callback(null, json_response);
                            
                        }
                         else 
                        {
                            return callback(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
                        
                        }
                    }); 
    
             
        }   else {
                    
            const newRoom = new Room({
    
                _id: new mongoose.Types.ObjectId(),
                user_id1: req.from,
                user_id2: req.to,

            });
            

            newRoom.save(function (err, data) {
                if (err) {
                  
                    return callback(null,response.ERROR);

                }
                if (data) {

                    const emojiMessage1 = emoji.emojify(req.message);
                    const newMessage = new Message({
    
                        _id: new mongoose.Types.ObjectId(),
                        sender: req.from,
                        receiver: req.to,
                        text: emojiMessage1,
                        roomid: data._id,        
                        senderName:req.senderName,
                        receiverName:req.receiverName,

                    });
                    if(req.image){
                        newMessage.image = req.image
                    }
        
                    newMessage.save(function (err, inserted) {
                        if (err) {
                          
                           
                            return callback(null,response.ERROR);
                        }
                        if (inserted) {
                           
                            var json_response = response.MESSAGE_ADDED
                            json_response.data = inserted
        
                            return callback(null, json_response);
                            
                        }
                         else 
                        {
                            return callback(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
                        
                        }
                    }); 

                    
                }
                 else 
                {
                    return callback(commonFunctions.sendErrorResponse(response.INETRNAL_SERVER_ERROR));
                
                }
            }); 

        }

    })
}
