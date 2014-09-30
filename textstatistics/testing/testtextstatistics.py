'''
Created on Sep 28, 2014

@author: mike
'''
import unittest

from textstatistics.textstatistics import  TextStatistics

class Test(unittest.TestCase):


    def testName(self):
        pass


    def testCleanText(self):
        #note the php version seems to turn . And to and
        # https://github.com/DaveChild/Text-Statistics/blob/master/tests/TextStatisticsTest.php
        str1 = 'There once was a little sausage named Baldrick. and he lived happily ever after.'
        str2 = 'There once was a little sausage named Baldrick. . . .  and he lived happily ever after.!! !??'
        
        ts = TextStatistics(str2)
        cleaned = ts.clean_text(str2)
        
        self.assertEqual(str1, cleaned, "Text cleaning equal")
        
        
        
    def testSyllableCount(self):
        text = "Super"
        
        ts = TextStatistics(text)
        scount = ts.syllable_count(text)
        print "Syllables in " + text + " is " + str(scount)
        
        
    def testSentenceCount(self):
        text = "The cat sat on the mat.  The hungry dog ate more food."
        ts = TextStatistics(text)
        sentence_count = ts.sentence_count(text)
        self.assertEquals(sentence_count, 2, "Two sentences in:  %s"%text)
        
    def testCounts(self):
        text = "There once was a little sausage named Baldrick."
        ts = TextStatistics(text)
        
        text_len = ts.text_length(text)
        self.assertEqual(47, text_len, "Baldrick 47 chars long")
        
        self.assertEqual(0, ts.letter_count(""), "Blank 0 letters long")
        self.assertEqual(0, ts.letter_count(" "), "Blank has no letters")
        
        letter_count = ts.letter_count(text)
        self.assertEqual(letter_count, 39, "47 in Baldrick sentence")
        
        self.assertEqual(0, ts.word_count(""), "0 words in empty string")
        self.assertEqual(0, ts.word_count(" "), "0 words in blank string")
        
        self.assertEqual(0, ts.letter_count(""), "0 letters in empty string")
        self.assertEqual(46, 
                     ts.letter_count('this sentence has 30 characters, not including the digits'),
                     "46 chars")
    """    
    def test_syllable_count_basic_words(self):
        ts = TextStatistics("")
        self.assertEqual(0, ts.syllable_count('.'));
        self.assertEqual(1, ts.syllable_count('a'));
        self.assertEqual(1, ts.syllable_count('was'));
        self.assertEqual(1, ts.syllable_count('the'));
        self.assertEqual(1, ts.syllable_count('and'));
        self.assertEqual(2, ts.syllable_count('foobar'));
        self.assertEqual(2, ts.syllable_count('hello'));
        self.assertEqual(1, ts.syllable_count('world'));
        self.assertEqual(3, ts.syllable_count('wonderful'));
        self.assertEqual(2, ts.syllable_count('simple'));
        self.assertEqual(2, ts.syllable_count('easy'));
        self.assertEqual(1, ts.syllable_count('hard'));
        self.assertEqual(1, ts.syllable_count('quick'));
        self.assertEqual(1, ts.syllable_count('brown'));
        self.assertEqual(1, ts.syllable_count('fox'));
        self.assertEqual(1, ts.syllable_count('jumped'));
        self.assertEqual(2, ts.syllable_count('over'));
        self.assertEqual(2, ts.syllable_count('lazy'));
        self.assertEqual(1, ts.syllable_count('dog'));
        self.assertEqual(3, ts.syllable_count('camera'));        
    """    
        
    def testFleschKincaidReadingEase(self):
        test_text1 = "This. Is. A. Nice. Set. Of. Small. Words. Of. One. Part. Each."
        test_text2 = "The quick brown fox jumps over the lazy dog."
        
        ts = TextStatistics(test_text1)
        easy_fk= ts.flesch_kincaid_reading_ease(test_text1)
        self.assertEqual(121.2, 
                         ts.flesch_kincaid_reading_ease(test_text1), 
                         "Easiest Flesch Kincaid score")
        
        easy_score = ts.flesch_kincaid_reading_ease(test_text2)
        """
        self.assertEqual(94.3,
                         easy_score,
                         "Easy Flesch Kincaid score")
        """
        
        blah = 0
        
    def testMisc(self):
        text = "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog"
        
        grade = TextStatistics(text).flesch_kincaid_grade_level(text)
        blah = 0

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()