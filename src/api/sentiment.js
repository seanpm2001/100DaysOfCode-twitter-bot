'use strict'

// const sentiment = require('../helpers/sentiment')
const config = require('../config')
const twit = require('twit')
const T = new twit(config.twitter)
const db = require('../helpers/db')

const unified = require('unified')
const sentiment = require('retext-sentiment')
const english = require('retext-english')
const inspect = require('unist-util-inspect')

const hashtagStream2 = T.stream('statuses/filter', {
  track: config.queryString
})

const sentimentBot = () => {
  hashtagStream2.on('tweet', tweet => {
    console.log(`Sentiment Bot Running`)
    
    const processor = unified()
      .use(english)
      .use(sentiment)

    const tree = processor.parse(tweet.text)

    processor.run(tree, tweet.text)

    console.log('====================')
    console.log(tree)
    console.log('====================')

    console.log(inspect(tree))

    // // Setup the http call
    // const httpCall = sentiment.init()

    // // Don't do anything if it's the bot tweet
    // if (tweet.user.screen_name == '_100DaysOfCode') return

    // httpCall.send('txt=' + tweet.text).end(result => {
    //   console.log('====================')
    //   console.log(result.status)
    //   console.log('====================')
    //   console.log(result.headers)
    //   console.log('====================')
    //   console.log(result.body)
    //   console.log('====================')
    //   // try
    //   try {
    //     let sentim = result.body.result.sentiment
    //     let confidence = parseFloat(result.body.result.confidence)
    //   } catch (err) {
    //     // derp out
    //     console.log(err)
    //     return
    //   }

    //   // if sentiment is Negative and the confidence is above 75%
    //   if (sentim == 'Negative' && confidence >= 75) {
    //     // get a random quote
    //     let phrase = sentiment.randomQuote()
    //     let screen_name = tweet.user.screen_name

    //     // Check key isn't in db already, key being the screen_name
    //     db.get(screen_name, (err, value) => {
    //       if (typeof value !== 'undefined') {
    //         console.log('ALREADY IN DB USER ', screen_name)
    //       } else {
    //         // Put a user name and that they have been encouraged
    //         db.put(screen_name, 'encourage', err => {
    //           // some kind of I/O error
    //           if (err) return console.log('Ooops!', err)

    //           console.log('LOGGED USER: ', screen_name)

    //           // tweet a random encouragement phrase
    //           tweetNow('@' + screen_name + ' ' + phrase)
    //         })
    //       }
    //     })
    //   }
    // })
  })
}

function tweetNow(text) {
  let tweet = { status: text }

  T.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      console.log('ERROR: ', err)
    }
    console.log('SUCCESS: Replied to Follower')
  })
}

module.exports = sentimentBot
