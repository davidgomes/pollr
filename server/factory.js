Meteor.startup(function () {
  Questions.remove({});
  Meteor.users.remove({});

  var user = Meteor.users.findOne({ username: "pedro" });

  if (!user) {
    Accounts.createUser({ username: "pedro", password: "pedro" });
  }

  user = Meteor.users.findOne({ username: "pedro" });

  if (Questions.find().count() === 0) {
    for (var i = 0; i < 10; i++) {
      var question = {
        userId: user._id,
        username: user.username,
        question: "Musica, tema pa " + i.toString(),
        hashtags: ["01", "02"],
        voters: [],
        answers: [
          { text: "erva", users: [], count: 0 },
          { text: "coca", users: [], count: 0 }
        ],
        timestamp: new Date()
      };

      Questions.insert(question);
    }
  }
});
