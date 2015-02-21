var POSTS_PER_PAGE = 5;

Meteor.methods({
  getFeed: function (version) {
    if (!this.userId) {
      throw new Meteor.Error("logged-out", "You must be logged in to get your feed.");
    }

    if (version < 1) {
      return [];
    }

    var user = Meteor.users.findOne(this.userId);

    var listQuestionsId = Questions.find( { $or: [{ userId: { $in: user.followees } }, { userId: this.userId } ] }, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE, skip: POSTS_PER_PAGE * (version - 1), fields: { _id: 1 } }).fetch();
//    var listQuestionsId = Questions.find({}, { sort: { timestamp: -1 }, limit: POSTS_PER_PAGE, skip: POSTS_PER_PAGE * (version - 1), fields: { _id: 1 } }).fetch();
    var listQuestions = [];

    for (var i = 0; i < listQuestionsId.length; i++) {
      listQuestions.push(listQuestionsId[i]._id);
    }

    return listQuestions;
  }
});
