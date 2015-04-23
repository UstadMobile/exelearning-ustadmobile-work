/**
 *  
 */

var ReadabilityHelper = function(text) {
	this.text = text;
	this.textStats = textstatistics(text);
};

ReadabilityHelper.prototype = {
	
	_roundNum: function(value, decimals) {
		if(typeof value === "number") {
			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}else {
			return value;
		}
	},
	
	/**
	 * From an array of words return an array of unique words
	 * 
	 */
	getUniqueWords: function(words) {
		words = (typeof words !== "undefined") ? words : this.textStats.getWords();
		var unique_words_dict = {};
		var unique_words_arr = [];
		
		for(var k = 0; k < words.length; k++) {
			var thisUWord = words[k].toLowerCase().replace(".", "").replace(",", "").replace("?","");
			unique_words_dict[thisUWord] = thisUWord; 
		}
		
		for(uWord in unique_words_dict) {
			if(unique_words_dict.hasOwnProperty(uWord)) {
				unique_words_arr.push(uWord);
			}
		}
		
		return unique_words_arr;
	},
		
	getReadabilityStats: function() {
		var result = {};
		if(this.text === "") {
			result.word_count = 0;
			result.sentences = [];
			result.sentence_count = 0;
		}else {
			result.word_count = this.textStats.wordCount();
			
			//sentence length
			sentences = this.textStats.getSentences();
			result.sentence_count = sentences.length || 1;
		}
		
		
		
		//word length
		result.word_length = [null, null];
		var words = this.text ?  this.textStats.getWords() : [];
		var wordLenTotal = 0;
		for(var i = 0; i < words.length; i++) {
			var wordLen = words[i].length;
			wordLenTotal += wordLen;
			
			if(result.word_length[0] === null || wordLen < result.word_length[0]) {
				result.word_length[0] = wordLen;
			}
			
			if(result.word_length[1] === null || wordLen > result.word_length[1]) {
				result.word_length[1] = wordLen;
			}
		}
		
		if(words.length === 0) {
			result.word_length_average = 0
		}else {
			result.word_length_average = this._roundNum(
				wordLenTotal/words.length, 2);
		}
		 
		//figure out unique words
		var unique_words = this.getUniqueWords(words);
		result.distinct_words = unique_words.length;
		
		//sentence length
		result.sentence_length = [null, null];
		var sentenceLenTotal = 0;
		for(var j = 0; j < sentences.length; j++) {
			var wordsInSentence = this.textStats.getWords(sentences[j]);
			var sentenceLen = wordsInSentence.length;
			sentenceLenTotal += sentenceLen;
			
			if(result.sentence_length[0] === null || sentenceLen < result.sentence_length[0]) {
				result.sentence_length[0] = sentenceLen;
			}
			
			if(result.sentence_length[1] === null || sentenceLen > result.sentence_length[1]) {
				result.sentence_length[1] = sentenceLen;
			}
		}
		
		if(sentences.length === 0) {
			result.sentence_length_average = 0;
		}else {
			result.sentence_length_average = this._roundNum(
					sentenceLenTotal/sentences.length, 2);
		}
		
		
		
		return result;
	}
};
