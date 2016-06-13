var SendMailOptions = function(data){
    data = data || {};
    this.from = data.from;
    this.to = data.to;
    this.subject = data.subject;
    this.text = data.text;
    this.html = data.html;
};
module.exports = SendMailOptions;
