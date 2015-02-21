Meteor.methods({
  search: function(querry) {
    // Parse any hashtags
    var hashtags = parseHashtags(querry);

    // Return results
    var result = [];
    hashtags.forEach(function(hashtag) {
      var hashtag = Hashtags.find({ name: hashtag }).fetch()[0];
      if(typeof hashtag != 'undefined') {
        var id = hashtag.id;
        var questions = Questions.find({ hashtags: { $elemMatch: { $eq: id  }  } }).fetch();

        questions.forEach(function(question) {
          result.push(question);
        });
      }
    });

    console.log(result)
    return result;
  }
});
