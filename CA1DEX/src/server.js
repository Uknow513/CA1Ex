import app from './app' ;
import { Server } from 'socket.io';

import NotificationSchema from './app/schemas/NotificationSchema';
import SchemaService from './app/services/SchemaService';

import { formatDBDate } from './app/utils/Helper';

const server = app.listen( process.env.PORT || 5050 , () => {
    console.log('Server is listening on ', process.env.PORT || 5050) ;
});

const socketIo = new Server(server, {
    cors : {
        origin : '*'
    }
})

global.io = socketIo ;

socketIo.on("connection", async (socket) => {
    console.log("New client connected: " + socket.id);
  
    socket.emit("getId", socket.id);

    let schemaService = new SchemaService(NotificationSchema) ;

    const notifications = await schemaService.find({}) ;

    let notificationList = [] ;
    for(let notification of notifications){
        notificationList.push({
            title : notification.title,
            description : notification.description,
            createdAt : formatDBDate(notification.createdAt , "datetime"),
            updatedAt : formatDBDate(notification.updatedAt, "datetime")
        })
    }
    socket.on("sendClientMsg", function(msg) {
        console.log(msg) ;
        socketIo.emit("sendDataServer",  notificationList );
    })
  
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
});