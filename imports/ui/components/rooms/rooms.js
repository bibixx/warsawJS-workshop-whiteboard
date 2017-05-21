import { FlowRouter } from 'meteor/kadira:flow-router';
import { Rooms } from '/imports/api/rooms/rooms.js';
import { Meteor } from 'meteor/meteor';
import './rooms.html';

Template.rooms.onCreated( function () {
  Meteor.subscribe('rooms.all');
} );

Template.rooms.helpers( {
  rooms() {
    return Rooms.find( {} );
  },

  roomId() {
    const id = FlowRouter.current().params.id;
    if ( id ) {
      return id;
    }

    return "";
  }
} );

Template.rooms.events( {
  'submit .add-room'( e ) {
    e.preventDefault();

    const roomName = e.target.title;

    Meteor.call( 'rooms.insert', roomName.value, ( error ) => {
      if ( error ) {
        console.error( error );
      } else {
        roomName.value = "";
      }
    } );
  },
  'click .remove'( e ) {
    Meteor.call( 'rooms.remove', e.target.id, ( error ) => {
      if ( error ) {
        console.error( error );
      }
    } );
  }
} );
