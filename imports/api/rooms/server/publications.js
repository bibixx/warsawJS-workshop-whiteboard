import { Meteor } from "meteor/meteor";
import { Rooms } from "../rooms.js";
import { check } from "meteor/check";

Meteor.publish( 'rooms.all', () => {
  return Rooms.find();
} );

Meteor.publish( 'rooms.getById', ( roomId ) => {
  check( roomId, String )
  return Rooms.find( { _id: roomId } );
} );
