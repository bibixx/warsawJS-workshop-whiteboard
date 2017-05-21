// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../api/rooms/rooms.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Rooms.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        createdAt: new Date(),
      },
    ];

    data.forEach(room => Rooms.insert(room));
  }
});
