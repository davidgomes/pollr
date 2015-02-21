Meteor.methods({
  followUser: function (otherId) {
    check(otherId, String);

    if (!this.userId) {
      throw new Meteor.Error("logged-out", "You must be logged in to follow someone.");
    }

    var user = Meteor.users.findOne(this.userId);
    var other = Meteor.users.findOne(otherId);

    if (!other) {
      throw new Meteor.Error("follow-fail", "Unexistent user.");
    }

    if (_.contains(user.followees, otherId)) {
      throw new Meteor.Error("follow-duplicate", "You are already following that user.");
    }

    Meteor.users.update(this.userId, { $addToSet: { followees: otherId } });
    Meteor.users.update(otherId, { $addToSet: { followers: this.userId } });
  },

  unfollowUser: function (otherId) {
    check(otherId, String);

    if (!this.userId) {
      throw new Meteor.Error("logged-out", "You must be logged in to follow someone.");
    }

    var user = Meteor.users.findOne(this.userId);
    var other = Meteor.users.findOne(otherId);

    if (!other) {
      throw new Meteor.Error("unfollow-fail", "Unexistent user.");
    }

    if (!_.contains(user.followees, otherId)) {
      throw new Meteor.Error("unfollow-miss", "You are not following that user.");
    }    

    Meteor.users.update(this.userId, { $pull: { followees: otherId } });
    Meteor.users.update(otherId, { $pull: { followers: this.userId } });
  }
});
