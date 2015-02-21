Meteor.startup(function () {
  Questions.remove({});
  Meteor.users.remove({});

  var namelist = ["pedro", "david", "joao"];
  var users = [];

  for (var i = 0; i < namelist.length; i++) {
    var name = namelist[i];
    var user = Meteor.users.findOne({ username: name });

    if (!user) {
      Accounts.createUser({ username: name, password: name });
    }

    user = Meteor.users.findOne({ username: name });
    users.push(user);
  }

  if (Questions.find().count() === 0) {
    for (var i = 0; i < 10; i++) {
      var question = {
        userId: users[i % users.length]._id,
        username: users[i % users.length].username,
        question: "Musica, tema pa " + i.toString(),
        hashtags: [],
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
