Meteor.publish('feed-questions', function (questionList) {
  check(questionList, [String]);
  
  return Questions.find({ _id: { $in: questionList } });
});

Meteor.publish('hashtags', function () {
  return Hashtags.find();
});

Meteor.publish('all-users', function() {
  return Meteor.users.find({}, { fields: { username: true, followers: true, followees: true } });
});
