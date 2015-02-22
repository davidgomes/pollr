Meteor.startup(function () {
  Questions.remove({});
  Hashtags.remove({});
  Meteor.users.remove({});

  var hashtag1 = getHashtag("ola");
  var hashtag2 = getHashtag("adeus");
  var hashtag3 = getHashtag("america");
  var hashtags = ["#ola", "#adeus", "#america"];
  var hashtagsIds = [hashtag1, hashtag2, hashtag3];

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
      associateUsers ([hashtagsIds[i % 3], hashtagsIds[(1 + i) % 3]], users[i % users.length]);
      associateHashtags ([hashtagsIds[i % 3], hashtagsIds[(1 + i) % 3]]);
      var question = {
        userId: users[i % users.length]._id,
        username: users[i % users.length].username,
        question: "Musica, " + hashtags[i % 3] + " " + hashtags[(1 + i) % 3]  + " tema pa " + i.toString(),
        hashtags: [{ name: hashtags[i % 3], _id: hashtagsIds[i % 3] }, { name: hashtags[(1 + i) % 3], _id: hashtagsIds[(1 + i) % 3] }],
        voters: [{ user: users[i % users.length]._id, option: 0 }],
        answers: [
          { text: "erva", users: [users[i % users.length]._id], count: 1, perc: 1 },
          { text: "coca", users: [], count: 0 }
        ],
        timestamp: new Date()
      };

      Questions.insert(question);
    }
  }
});
