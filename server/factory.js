Meteor.startup(function () {
  Questions.remove({});

  if (Questions.find().count() === 0) {
    for (var i = 0; i < 10; i++) {
      var question = {
        userId: "00",
        question: "Musica, tema pa " + i.toString(),
        hashtags: ["01", "02"],
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
