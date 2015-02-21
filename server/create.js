function getHashtag (hashtagName) {
  check(hashtagName, String);

  var hashtagId = Hashtags.findOne({name: hashtagName});

  if (!hashtagId) {
    var hashtag = { name: hashtagName };
    hashtagId = Hashtags.insert(hashtag);
    
  }

  return hashtagId;
}

function getHashtags (hashtags) {
  check(hashtags, [String]);

  var hashtagsById = [];

  for (var hashtag in hashtags) {
    var hashtagId = getHashtag(hashtag);
    hashtagsById.push(hashtagId);
  }

  return hashtagsById;
}

Meteor.methods({
  newQuestion: function (questionText, answers) {
    check(questionText, String);
    check(answers, [String]);

    if (!this.userId) {
      throw new Meteor.Error("logged-out", "You must be logged in to post a question.");
    }

    // Parse hashtags
    var hashtagsById = [];
    var answersList = [];

    for (var i = 0; i < answers.length(); i++) {
      var answer = {
        text: answers[i],
        users: [],
        count: 0
      };
      answersList.push(answer);
    }

    var question = {
      userId: this.userId,
      question: questionText,
      hashtags: hashtagsById,
      answers: answersList
    };

    var questionId = Questions.insert(question);

    if (!questionId) {
      throw new Meteor.Error("question-insert", "Internal error creating question.");
    }

    return questionId;
  },

  vote: function (questionId, option) {
    check(questionId, String);
    check(option, Match.Integer);

    if (!this.userId) {
      throw new Meteor.Error("logged-out", "You must be logged in to vote in a question.");
    }

    var question = Questions.findOne(questionId);

    if (!question) {
      throw new Meteor.Error("question-fail", "The question you required doesn't exist.");
    }

    if (question.answers.length() >= option || option < 0) {
      throw new Meteor.Error("answer-fail", "Invalid vote.");
    }

    question.answers[option].count++;

    Questions.update(questionId, { $addToSet: { 'answers.option.users': this.userId } });
    Questions.update(questionId, { $inc: { 'answers.option.count': 1 } });
  }
});
