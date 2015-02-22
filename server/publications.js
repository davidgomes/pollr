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

Meteor.publish('profile-questions', function (version, otherName, user) {
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
  
  user = Meteor.users.findOne({ username: otherName });

  if (!user) {
    return [];
  }

  return Questions.find({ userId: user._id }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE * (1 + version) });
});

Meteor.publish('random-questions', function (version) {
  if (!version) {
    version = 0;
  }
  
  check(version, Match.Integer);

  return Questions.find({  }, { sort: { timestamp: -1} , limit: POSTS_PER_PAGE * (1 + version) });
});

Meteor.publish('discover-questions', function (idsList) {
  if (!idsList) {
    return [];
  }

  check(idsList, [String]);

  return Questions.find({ _id: { $in: idsList } }, { sort: { timestamp: -1 } });
});

Meteor.publish('hashtags', function () {
  return Hashtags.find();
});

Meteor.publish('single-question', function (id) {
  check(id, String);

  return Questions.find(id);
});

Meteor.publish('all-users', function() {
  return Meteor.users.find({}, { fields: { username: true, followers: true, followees: true, related: true, image: true } });
});
