// TextStatistics.js
// Christopher Giffard (2012)
// 1:1 API Fork of TextStatistics.php by Dave Child (Thanks mate!)
// https://github.com/DaveChild/Text-Statistics


(function(glob) {
	
	function cleanText(text) {
		// all these tags should be preceeded by a full stop. 
		var fullStopTags = ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd'];
		
		fullStopTags.forEach(function(tag) {
			text = text.replace("</" + tag + ">",".");
		});
		
		if(!TextStatistics.defaultOptions.sentenceTerminatorsRegex) {
			var terminatorChars = "";
			for(var set in TextStatistics.defaultOptions.sentenceTerminators) {
				if(TextStatistics.defaultOptions.sentenceTerminators.hasOwnProperty(set)) {
					terminatorChars += 
						TextStatistics.defaultOptions.sentenceTerminators[set];
				}
			}
			
			TextStatistics.defaultOptions.sentenceTerminatorsRegex =
				new RegExp("[" + terminatorChars + "]");
		}
		
		
		
		text = text
			.replace(/<[^>]+>/g, "")				// Strip tags
			.replace(/[,:;()\-]/, " ")				// Replace commans, hyphens etc (count them as spaces)
			.replace(TextStatistics.defaultOptions.sentenceTerminatorsRegex, ".")		// Unify terminators
			.replace(/^\s+/,"")						// Strip leading whitespace
			.replace(/[ ]*(\n|\r\n|\r)[ ]*/," ")	// Replace new lines with spaces
			.replace(/([\.])[\. ]+/,".")			// Check for duplicated terminators
			.replace(/[ ]*([\.])/,". ")				// Pad sentence terminators
			.replace(/\s+/," ")						// Remove multiple spaces
			.replace(/\s+$/,"");					// Strip trailing whitespace
			
		text += "."; // Add final terminator, just in case it's missing.
		
		return text;
	}
	
	var TextStatistics = function TextStatistics(text, options) {
		this.text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		this.options = options || {};
	};
	
	TextStatistics.defaultOptions = {
		/* All sentence terminators as per output from:
		 * $ unichars -gas '[\p{Sentence_Break=STerm}\p{Sentence_Break=ATerm}]' '\p{Terminal_Punctuation}'
		 * 
		 */
		sentenceTerminators : {
			"common" : "\u00021\u0002E\u0003F\u203C\u203D\u2047\u2048"+
				"\u2049\u2E2E\u3002\uFE52\uFE56\uFE57\uFF01\uFF0E"+
				"\uFF1F\uFF61",
			"armenian" : "\u0589",
			"arabic" : "\u061F\u06D4",
			"syriac" : "\u0700\u0701\u0702",
			"nko" : "\u07F9",
			"devanagari" : "\u0964\u0965",
			"myanmar" : "\u104A\u104B",
			"ethiopic" : "\u1362\u1367\u1368",
			"canadian_aboriginal" : "\u166E",
			"mongolian" : "\u1803\u1809",
			"limbu": "\u1944\u1945",
			"tai_tham": "\u1AA8\u1AA9\u1AAA\u1AAB",
			"balinese" : "\u1B5A\u1B5B\u1B5E\u1B5F",
			"lepcha": "\u1C3B\u1C3C",
			"ol_chiki" : "\u1C7E\u1C7F",
			"lisu" : "\uA4FF",
			"vai" : "\uA60E\uA60F",
			"bamum" : "\uA6F3\uA6F7",
			"phags_pa" : "\uA876\uA877",
			"saurashtra" : "\uA8CE\uA8CF",
			"kayah_li" : "\uA92F",
			"javanese" : "\uA9C8\uA9C9",
			"cham" : "\uAA5D\uAA5E\uAA5F",
			"meetei_mayek" : "\uAAF0\uAAF1\uABEB",
			"brahmi" : "\u11047\u11048",
			"kaithi" : "\u110BE\u110BF\u110C0\u110C1",
			"chakma" : "\u11141\u11142\u11143",
			"sharada" : "\u111C5\u111C6"
		},
		nonAlphaNumericChars: /['"\.,:;\+\-\*\$\%\/\\\(\)\}\{&]+/
	};
	
	/**
	 * Get an option for this TextStatistics; if we have it set use
	 * instance option, otherwise fall back to defaults
	 * 
	 * @param optName {String} name of option
	 * @returns value of the option
	 */
	TextStatistics.prototype.getOption = function(optName) {
		return this.options[optName] || TextStatistics.defaultOptions[optName];
	};
	
	TextStatistics.prototype.fleschKincaidReadingEase = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return Math.round((206.835 - (1.015 * this.averageWordsPerSentence(text)) - (84.6 * this.averageSyllablesPerWord(text)))*10)/10;
	};
	
	TextStatistics.prototype.fleschKincaidGradeLevel = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return Math.round(((0.39 * this.averageWordsPerSentence(text)) + (11.8 * this.averageSyllablesPerWord(text)) - 15.59)*10)/10;
	};
	
	TextStatistics.prototype.gunningFogScore = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return Math.round(((this.averageWordsPerSentence(text) + this.percentageWordsWithThreeSyllables(text, false)) * 0.4)*10)/10;
	};
	
	TextStatistics.prototype.colemanLiauIndex = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return Math.round(((5.89 * (this.letterCount(text) / this.wordCount(text))) - (0.3 * (this.sentenceCount(text) / this.wordCount(text))) - 15.8 ) *10)/10;
	};
	
	TextStatistics.prototype.smogIndex = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return Math.round(1.043 * Math.sqrt((this.wordsWithThreeSyllables(text) * (30 / this.sentenceCount(text))) + 3.1291)*10)/10;
	};
	
	TextStatistics.prototype.automatedReadabilityIndex = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return Math.round(((4.71 * (this.letterCount(text) / this.wordCount(text))) + (0.5 * (this.wordCount(text) / this.sentenceCount(text))) - 21.43)*10)/10;
	};

	TextStatistics.prototype.textLength = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return text.length;
	};
	
	TextStatistics.prototype.letterCount = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		text = text.replace(/[^a-z]+/ig,"");
		return text.length;
	};
	
	TextStatistics.prototype.getSentences = function(text) {
		text = text ? cleanText(text) : this.text;
		
		//can include empty sentences
		var sentenceSplit = text.split(/[\.!?]/g);
		
		var sentences = this.removeBlanks(sentenceSplit);
		
		return sentences;
	};
	
	TextStatistics.prototype.removeBlanks = function(arr) {
		var retVal = [];
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] !== "") {
				retVal.push(arr[i]);
			}
		}
		
		return retVal;
	};
	
	TextStatistics.prototype.sentenceCount = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		
		// Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
		return text.replace(/[^\.!?]/g, '').length || 1;
	};
	
	TextStatistics.prototype.wordCount = function(text) {
		return this.getWords(text).length;
	};
	
	
	TextStatistics.prototype.getWords = function(text) {
		text = text ? cleanText(text) : this.text;
		
		/* cleanText will convert sentence terminators into . */
		var nonAlphaRegex = this.getOption("nonAlphaNumericChars");
		var words = text.replace(".", "").replace(nonAlphaRegex, "").split(/\s+/);
		words = this.removeBlanks(words);
		
		return words;
	};
	
	TextStatistics.prototype.averageWordsPerSentence = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		return this.wordCount(text) / this.sentenceCount(text);
	};
	
	TextStatistics.prototype.averageSyllablesPerWord = function(text) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		var syllableCount = 0, wordCount = this.wordCount(text), self = this;
		
		text.split(/\s+/).forEach(function(word) {
			syllableCount += self.syllableCount(word);
		});
		
		// Prevent NaN...
		return (syllableCount||1) / (wordCount||1);
	};
	
	TextStatistics.prototype.wordsWithThreeSyllables = function(text, countProperNouns) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		var longWordCount = 0, self = this;
		
		countProperNouns = countProperNouns === false ? false : true;
		
		text.split(/\s+/).forEach(function(word) {
			
			// We don't count proper nouns or capitalised words if the countProperNouns attribute is set.
			// Defaults to true.
			if (!word.match(/^[A-Z]/) || countProperNouns) {
				if (self.syllableCount(word) > 2) longWordCount ++;
			}
		});
		
		return longWordCount;
	};
	
	TextStatistics.prototype.percentageWordsWithThreeSyllables = function(text, countProperNouns) {
		text = (typeof text !== "undefined") ? cleanText(text) : this.text;
		
		return (this.wordsWithThreeSyllables(text,countProperNouns) / this.wordCount(text)) * 100;
	};
	
	TextStatistics.prototype.syllableCount = function(word) {
		var syllableCount = 0,
			prefixSuffixCount = 0,
			wordPartCount = 0;
		
		// Prepare word - make lower case and remove non-word characters
		word = word.toLowerCase().replace(/[^a-z]/g,"");
	
		// Specific common exceptions that don't follow the rule set below are handled individually
		// Array of problem words (with word as key, syllable count as value)
		var problemWords = {
			"simile":		3,
			"forever":		3,
			"shoreline":	2
		};
		
		// Return if we've hit one of those...
		if (problemWords.hasOwnProperty(word)) return problemWords[word];
		
		// These syllables would be counted as two but should be one
		var subSyllables = [
			/cial/,
			/tia/,
			/cius/,
			/cious/,
			/giu/,
			/ion/,
			/iou/,
			/sia$/,
			/[^aeiuoyt]{2,}ed$/,
			/.ely$/,
			/[cg]h?e[rsd]?$/,
			/rved?$/,
			/[aeiouy][dt]es?$/,
			/[aeiouy][^aeiouydt]e[rsd]?$/,
			/^[dr]e[aeiou][^aeiou]+$/, // Sorts out deal, deign etc
			/[aeiouy]rse$/ // Purse, hearse
		];
	
		// These syllables would be counted as one but should be two
		var addSyllables = [
			/ia/,
			/riet/,
			/dien/,
			/iu/,
			/io/,
			/ii/,
			/[aeiouym]bl$/,
			/[aeiou]{3}/,
			/^mc/,
			/ism$/,
			/([^aeiouy])\1l$/,
			/[^l]lien/,
			/^coa[dglx]./,
			/[^gq]ua[^auieo]/,
			/dnt$/,
			/uity$/,
			/ie(r|st)$/
		];
	
		// Single syllable prefixes and suffixes
		var prefixSuffix = [
			/^un/,
			/^fore/,
			/ly$/,
			/less$/,
			/ful$/,
			/ers?$/,
			/ings?$/
		];
	
		// Remove prefixes and suffixes and count how many were taken
		prefixSuffix.forEach(function(regex) {
			if (word.match(regex)) {
				word = word.replace(regex,"");
				prefixSuffixCount ++;
			}
		});
		
		wordPartCount = word
			.split(/[^aeiouy]+/ig)
			.filter(function(wordPart) {
				return !!wordPart.replace(/\s+/ig,"").length
			})
			.length;
		
		// Get preliminary syllable count...
		syllableCount = wordPartCount + prefixSuffixCount;
		
		// Some syllables do not follow normal rules - check for them
		subSyllables.forEach(function(syllable) {
			if (word.match(syllable)) syllableCount --;
		});
		
		addSyllables.forEach(function(syllable) {
			if (word.match(syllable)) syllableCount ++;
		});
		
		return syllableCount || 1;
	};
	
	function textStatistics(text) {
		return new TextStatistics(text);
	}
	
	(typeof module != "undefined" && module.exports) ? (module.exports = textStatistics) : (typeof define != "undefined" ? (define("textstatistics", [], function() { return textStatistics; })) : (glob.textstatistics = textStatistics));
})(this);
