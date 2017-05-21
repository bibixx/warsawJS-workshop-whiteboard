import { FlowRouter } from "meteor/kadira:flow-router";
import { Rooms } from "/imports/api/rooms/rooms.js";
import { Meteor } from "meteor/meteor";
import "./room.html";
import "./room.css";

import { CanvasManager } from "/imports/utils/client/canvas_manager.js";

let canvas_manager = null;
let isCanvasCreated = false;

let oldScreen = [];
let lastScreen = null;
let initScreen = null;
let colorRandom = true;

Template.room.onCreated( function () {
  const id = FlowRouter.getParam( "id" );
  Meteor.subscribe( "rooms.getById", id );
} );

Template.room.onRendered( function() {
  this.autorun( () => {
    if ( !isCanvasCreated ) {
      const canvas = document.getElementById( "canvas" );
      const room = Rooms.findOne( FlowRouter.getParam( "id" ) );
      if ( room ) {
        canvas_manager = new CanvasManager( canvas, {
          // instant: true,
          callback() {
            Meteor.call( "rooms.updateDataUrl", FlowRouter.getParam( "id" ), canvas.toDataURL() );
            oldScreen.unshift( lastScreen );
            lastScreen = canvas.toDataURL();
            if ( document.getElementById( "random-color" ).checked ) {
              canvas_manager.color = "hsl( " + Math.round( Math.random() * 360 )  +  ", 100%, 50% )";
            }
          }
        } );
        canvas_manager.load( room.dataUrl );
        lastScreen = room.dataUrl;

        isCanvasCreated = true;
      }
    }
  } );
} );

Template.room.helpers( {
  room() {
    const room = Rooms.findOne( FlowRouter.getParam( "id" ) )
    if ( room && canvas_manager ) {
      canvas_manager.load( room.dataUrl );
    }
    return room;
  }
} );

Template.room.onDestroyed( () => {
  isCanvasCreated = false;
} )

Template.room.events( {
  "input #slider"( e ) {
    canvas_manager.size = e.target.value * 1;
    document.getElementById( "slider-range" ).value = e.target.value * 1;
  },
  "input #slider-range"( e ) {
    canvas_manager.size = e.target.value * 1;
    document.getElementById( "slider" ).value = e.target.value * 1;
  },
  "change #color"( e ) {
    canvas_manager.color = e.target.value;
  },
  "click #clear"( e ) {
    const canvas = document.getElementById( "canvas" );
    canvas_manager.fill( "#FFFFFF" );
  },
  "click #fill"( e ) {
    const canvas = document.getElementById( "canvas" );
    canvas_manager.fill( document.getElementById( "color" ).value );
  },
  "click #undo"( e ) {
    if ( oldScreen.length >= 0 ) {
      canvas_manager.load( oldScreen[ 0 ] );
      Meteor.call( "rooms.updateDataUrl", FlowRouter.getParam( "id" ), oldScreen[ 0 ] );

      oldScreen.shift();
    }
  },
  "change #random-color"( e ) {
    if ( e.target.checked ) {
      canvas_manager.color = "hsl( " + Math.round( Math.random() * 360 )  +  ", 100%, 50% )";
    } else {
      canvas_manager.color = "hsl( 0, 100%, 0% )";
    }
  }
} );

document.addEventListener( "mousemove", ( e ) => {
  const cursor = document.getElementById( "cursor" );
  if ( cursor ) {
    const cursorS = cursor.style;
    cursorS.top = e.pageY + "px";
    cursorS.left = e.pageX + "px";
    cursorS.height = canvas_manager.size + "px";
    cursorS.width = canvas_manager.size + "px";
  }
} );
