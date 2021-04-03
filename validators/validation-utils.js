module.exports.linkPattern = /\b((http|https):\/\/?)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/;

module.exports.validateLink = (link) => this.linkPattern.test(link);
