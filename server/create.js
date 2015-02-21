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

    var user = Meteor.users.findOne(this.userId);

    var hashtags = [];
    var hashFlag = false;
    var currentHash = "";
    for (var i = 0; i < questionText.length; i++) {
      var chr = questionText[i];
      if (chr === '#' || chr === ' ') {
        if (hashFlag === true) {
          hashtags.push(currentHash);
        }

        currentHash = "";

        if (chr === '#') {
          hashFlag = true;
        } else {
          hashFlag = false;
        }
        
        continue;
      }

      if (hashFlag) {
        currentHash += chr;
      }
    }

    if (hashFlag === true) {
      hashtags.push(currentHash);
      console.log(currentHash);
    }

    var hashtagsById = getHashtags(hashtags);
    var answersList = [];

    for (var i = 0; i < answers.length; i++) {
      var answer = {
        text: answers[i],
        users: [],
        count: 0
      };
      answersList.push(answer);
    }

    var question = {
      userId: this.userId,
      username: user.username,
      question: questionText,
      hashtags: hashtagsById,
      voters: [],
      answers: answersList,
      timestamp: new Date()
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

    if (question.answers.length <= option || option < 0) {
      throw new Meteor.Error("answer-fail", "Invalid vote.");
    }

    if (_.contains(question.answers[option].users, this.userId)) {
      throw new Meteor.Error("answer-duplicate", "You have already voted on this question.");
    }

    var flag = false;
    var prevOption = 0;
    for (var i = 0; i < question.voters.length; i++) {
      var voter = question.voters[i];
      if (voter.user == this.userId) {
        flag = true;
        prevOption = voter.option;
      }
    }

    if (flag) {
      question.answers[prevOption].count--;
      var prevIndex = question.answers[prevOption].users.indexOf(this.userId);
      if (prevIndex > -1) {
        question.answers[prevOption].users.splice(prevIndex, 1);
      }
      
      Questions.update(questionId, { $pull: { voters: { user: this.userId, option: prevOption } } });
    }

    question.answers[option].count++;
    question.answers[option].users.push(this.userId);

    Questions.update(questionId, { $set: { answers: question.answers } });
    Questions.update(questionId, { $addToSet: { voters: { user: this.userId, option: option } } });
  }
});
