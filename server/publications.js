Meteor.publish('all-questions', function () {
    return Questions.find();
});

Meteor.publish('hashtags', function () {
    return Hashtags.find();
});

Meteor.publish('all-users', function() {
  return Meteor.users.find({}, { fields: { username: true, followers: true, followees: true } });
});
