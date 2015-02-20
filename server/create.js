Questions = new Mongo.Collection("questions");
Hashtags = new Mongo.Collection;

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
  newQuestion: function (questionText, hashtags, answers) {
    check(questionText, String);
    check(hashtags, [String]);
    check(answers, [String]);

    if (!this.userId) {
      throw new Meteor.Error("logged-out", "You must be logged in to post a question.");
    }

    var hashtagsById = getHashtags(hashtags);
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

    var questionId = Question.insert(question);

    if (!questionId) {
      throw new Meteor.Error("question-insert", "Internal error creating question.");
    }

    return questionId;
  }
});
