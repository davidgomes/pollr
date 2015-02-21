Meteor.publish('feed-questions', function (version, user) {
  if (!version) {
    version = 0;
  }
  
  check(version, Match.Integer);

  if (!user) {
    return [];
  }

  if (this.userId != user._id) {
    return [];
  }
  
  user = Meteor.users.findOne(this.userId);

  if (!user) {
    return [];
  }

  return Questions.find( { $or: [{ userId: { $in: user.followees } }, { userId: this.userId } ] }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + version) });
});

Meteor.publish('search-questions', function (version, query, user) {
  if (!version) {
    version = 0;
  }

  check(query, String);
  check(version, Match.Integer);

  if (!user) {
    return [];
  }

  if (this.userId != user._id) {
    return [];
  }
  
  user = Meteor.users.findOne(this.userId);

  if (!user) {
    return [];
  }

  query = query.substring(1, query.length);
  var hashtag = Hashtags.findOne({ name: query });

  if (!hashtag) {
    return [];
  }

  return Questions.find({ hashtags: { $elemMatch: { _id: hashtag._id }}}, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + version) });
});

Meteor.publish('hashtags', function () {
  return Hashtags.find();
});

Meteor.publish('all-users', function() {
  return Meteor.users.find({}, { fields: { username: true, followers: true, followees: true } });
});
