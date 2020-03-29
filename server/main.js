import { Meteor } from 'meteor/meteor';
import UserFiles  from '../imports/api/userFiles.js';

Meteor.publish('files.all', function () {
  return UserFiles.find().cursor;
});

Meteor.methods({'RemoveFile'(id) {   
      UserFiles.remove({_id: id}, function (error) {
          if (error) {
            console.error("File wasn't removed, error: " + error.reason)
          } else {
            console.info("File successfully removed");
          }
      });
  },
});

Meteor.methods({'RenameFile' (id, newName) {   
      UserFiles.update({_id: id }, {$set: {name: newName}}, function (error) {
      if (error) {
        console.error("File wasn't rename, error: " + error.reason)
      } else {
        console.info("File successfully rename");
      }
    });
  },
});