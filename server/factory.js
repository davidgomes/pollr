Meteor.startup(function () {
  Questions.remove({});
  Meteor.users.remove({});

  var hashtag1 = getHashtag("ola");
  var hashtag2 = getHashtag("adeus");
  var hashtags = ["#ola", "#adeus"];
  var hashtagsIds = [hashtag1, hashtag2];

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
  
  Meteor.users.update(users[0]._id, { $addToSet: { followees: users[1]._id } });
  Meteor.users.update(users[1]._id, { $addToSet: { followers: users[0]._id } });

  if (Questions.find().count() === 0) {
    for (var i = 0; i < 10; i++) {
      var question = {
        userId: users[i % users.length]._id,
        username: users[i % users.length].username,
        question: "Musica, " + hashtags[i % 2] + " tema pa " + i.toString(),
        hashtags: [hashtagsIds[i % 2]],
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
