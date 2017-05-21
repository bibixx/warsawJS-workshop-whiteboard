import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Rooms } from "./rooms.js";

Meteor.methods( {
  "rooms.insert"( title ) {
    check( title, String );

    return Rooms.insert( {
      title,
      createdAt: new Date(),
    } )
  },
  "rooms.remove"( id ) {
    return Rooms.remove( id );
  },
  "rooms.updateDataUrl"( roomId, dataUrl ) {
    check( roomId, String );
    check( dataUrl, String );

    Rooms.update( roomId, {
      $set: {
        dataUrl,
        updatedAt: new Date(),
      }
    } );
  }
} );
