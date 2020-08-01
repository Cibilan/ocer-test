const natural = require('natural');

const aposToLexForm = require('apos-to-lex-form');

const SpellCorrector = require('spelling-corrector');

const tm = require( 'text-miner' );

const SW = require('stopword');
const { text } = require('express');

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

exports.tokenizerv1 = async (text) =>{
    try {

        const lexedReview = aposToLexForm(text);
        const casedReview = lexedReview.toLowerCase();   
        const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

        const stemmed = natural.PorterStemmer.stem(alphaOnlyReview);

        const tokenizer = new natural.WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(stemmed);

        // spell checker
        // tokenizedReview.forEach((word, index) => {
        //     tokenizedReview[index] = spellCorrector.correct(word);
        // })

        const filteredReview = SW.removeStopwords(tokenizedReview);

        return filteredReview


    } catch (err){
        return err
    } 
}

// not completed
exports.tokenizerv2 = async (text) =>{
    try{
        var my_corpus = new tm.Corpus([]);

        my_corpus
            .addDoc(text)

        return my_corpus

    }catch (err){
        return err
    }
}
