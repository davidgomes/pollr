var POSTS_PER_PAGE = 5;

Meteor.publish('feed-questions', function (version) {
  if (!version) {
    version = 0;
  }
  
  check(version, Match.Integer);
  
  var user = Meteor.users.findOne(this.userId);

  if (!user) {
    return [];
  }
  
  return Questions.find( { $or: [{ userId: { $in: user.followees } }, { userId: this.userId } ] }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + version) });
});

Meteor.publish('hashtags', function () {
  return Hashtags.find();
});

Meteor.publish('all-users', function() {
  return Meteor.users.find({}, { fields: { username: true, followers: true, followees: true } });
});
