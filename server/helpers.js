parseHashtags = function(string) {
  var hashtags = [];
  var hashFlag = false;
  var currentHash = "";
  for (var i = 0; i < string.length; i++) {
    var chr = string[i];

    if (chr === '#' || chr === ' ') {
      if (hashFlag === true) {
        hashtags.push(currentHash.toLowerCase());
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
  }

  console.log(hashtags)
  return hashtags;
}
