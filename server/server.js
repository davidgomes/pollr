var POSTS_PER_DISCOVER = 12;

function getQuestionId(hashtagId) {
  var preList = Questions.find({ hashtags: { $elemMatch: { _id: hashtagId } } }, { limit: 5, sort: { timestamp: -1 } }).fetch();

  var ans = preList[Math.floor(Math.random() * preList.length)];

  if (ans) {
    return ans._id;
  } else {
    return null;
  }
}

associateUsers = function (hashtags, user) {
  for (var i = 0; i < hashtags.length; i++) {
    var pHashtag = Hashtags.findOne(hashtags[i]);

    var flag = true;
    for (var k = 0; k < user.related.length; k++) {
      if (user.related[k].id === pHashtag._id) {
        var sim = user.related[k];
        sim[k].score++;
        Meteor.users.update(user._id, { $set: { related: sim } });
        flag = false;
        break;
      }
    }

    if (flag) {
      Meteor.users.update(user._id, { $addToSet: { related: { id: pHashtag._id, score: 1 } } });
    }
  }
};

associateHashtags = function (hashtags) {
  for (var i = 0; i < hashtags.length; i++) {
    var pHashtag = Hashtags.findOne(hashtags[i]);

    for (var j = 0; j < hashtags.length; j++) {
      if (i === j) {
        continue;
      }

      var sHashtag = Hashtags.findOne(hashtags[j]);

      var flag = true;
      for (var k = 0; k < pHashtag.similar.length; k++) {
        if (pHashtag.similar[k].id === sHashtag._id) {
          var sim = pHashtag.similar;
          sim[k].score++;
          Hashtags.update(pHashtag._id, { $set: { similarity: sim } });
          flag = false;
          break;
        }
      }

      if (flag) {
        Hashtags.update(pHashtag._id, { $addToSet: { similar: { id: sHashtag._id, score: 1 } } });
      }
    }
  }
};

getHashtag = function (hashtagName) {
  check(hashtagName, String);

  var hashtagId = Hashtags.findOne({name: hashtagName});

  if (!hashtagId) {
    var hashtag = { name: hashtagName, similar: [], color: randomColor({ luminosity: 'light', hue: 'green' }) };
    hashtagId = Hashtags.insert(hashtag);
  }

  return hashtagId;
};

function getHashtags(hashtags) {
  check(hashtags, [String]);

  var hashtagsById = [];

  for (var i = 0; i < hashtags.length; i++) {
    var hashtag = hashtags[i];
    var hashtagId = getHashtag(hashtag);
    hashtagsById.push(Hashtags.findOne(hashtagId));
  };

  return hashtagsById;
}

Meteor.methods({
  newQuestion: function (questionText, answers) {
    check(questionText, String);
    check(answers, [String]);

    // Question Validation
    if (questionText.length < 4) {
      throw new Meteor.Error("question-length", "Question should be at least 4 characters long.");
    }

    // Answer Validation
    answers.forEach(function(answer) {    
      if (answer.length < 1) {
        throw new Meteor.Error("answer-length", "Answer should be at least 1 character long.");
      }
    });

    var user = Meteor.users.findOne(this.userId);

    var hashtags = parseHashtags(questionText);
    associateHashtags(hashtags);
    associateUsers(hashtags, user);
    var hashtagsById = getHashtags(hashtags);

    var answersList = [];

    for (var i = 0; i < answers.length; i++) {
      var answer = {
        text: answers[i],
        users: [],
        count: 0
      };
      if (answersList.indexOf(answer) > -1) {
        throw new Meteor.Error("answer-diplacates", "Answers should not be duplicated.");
      }
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

    var flag = false;
    var prevOption = 0;
    for (var i = 0; i < question.voters.length; i++) {
      var voter = question.voters[i];
      if (voter.user == this.userId) {
        flag = true;
        prevOption = voter.option;
      }
    }

    if (flag && option === prevOption) {
      question.answers[prevOption].count--;
      var prevIndex = question.answers[option].users.indexOf(this.userId);

      if (prevIndex > -1) {
        question.answers[option].users.splice(prevIndex, 1);
      }
      
      Questions.update(questionId, { $pull: { voters: { user: this.userId, option: option } } });
      Questions.update(questionId, { $set: { answers: question.answers } });

      return;
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
  },

  getDiscover: function () {
    if (!this.userId) {
      return [];
    }

    var user = Meteor.users.findOne(this.userId);
    var parties = [];
    var results = [];

    for (var i = 0; i < user.related.length; i++) {
      parties.push({ id: user.related[i].id, score: user.related[i].score, chosen: 0 } );
    }

    if (parties.length === 0) {
      return [];
    }

    for (var i = 0; i < POSTS_PER_DISCOVER; i++) {
      _.sortBy(parties, function(party) {
        return -party.score / party.chosen;
      });

      parties[0].chosen++;
      var next = getQuestionId(parties[0].id);

      if (next && !_.contains(results, next)) {
        results.push(next);
      }
    }
    
    return results;
  }
});
