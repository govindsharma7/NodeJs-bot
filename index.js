const Discord = require('discord.js');
const auth = require('./config/auth.json');
const HistoryQuery = require('./controller/history');
const GSR = require('google-search-results-nodejs');

// Google Search API
let googleSearchApi = new GSR.GoogleSearchResults(auth.googleApiKey)

// Initiallized Discord
const client = new Discord.Client();

// Ready Function
client.once('ready', () => {
    client.guilds.cache.forEach( (record) => {
        if ( record.name === auth.guilds_name ) {
            console.log(client.user.username + ' is connected to the following guild:\n')
            console.log(record.name + ' (id: ' + record.id + ')')
        }
    })
    console.log('Ready!');
});

// Authanticate using token
client.login(auth.token);

var parameter = {};

// Sending Response
client.on('message', message => {
    let user = {...message.author}
    // Condition for message check
    if ( message.content === 'hi' ) {
        let userRecord = {
            'user': user,
            'query': ''
        };
        querySetRecord(userRecord, message, []);
        message.channel.send('hey');
    } else if ( message.content.startsWith('!google') ) {
        let query = (message.content).replace('!google', '').trim();
        parameter = {
            q: query
        }
        getSearchRecord(message, user, query);
    } else if ( message.content.startsWith('!recent') ) {
        let searchstring = (message.content).replace('!recent', '').trim();
        stringData = '.*'+searchstring+'.*'
        HistoryQuery.searchString(stringData, user, (err, history) => {
            if ( history ) {
                dataRecord = []
                history.forEach( ( data ) => {
                    dataRecord.push(data.search_key)
                    dataRecord = dataRecord.concat(data.result)
                });
                message.channel.send(dataRecord.join('\n'));
            } else {
                console.log(err);
                message.channel.send('No recent record available, try `!google ' + searchstring + '`');
            }
        });
    }
});

function getSearchRecord(message, user, query) {
    /*
        Google Search Api and sending to the bot response
    */
    googleSearchApi.json(parameter, data => {
        let urlList = [];
        let organicResults = data.organic_results;
        organicResults = organicResults.splice(0, 5);
        urlList = [...organicResults];
        urlList = urlList.map((url) => url.link);
        message.channel.send(urlList.join('\n'));
        let userRecord = {
            'user': user,
            'query': query
        };
        querySetRecord(userRecord, message, urlList);
    });
}

function querySetRecord(userRecord, message, urlList) {
    /*
        Function used to find the record and create an new record.
        * Manage the history.
    */
    HistoryQuery.findOne(userRecord, (err, history) => {
        if (!history) {
            let data = {
                'user': userRecord.user,
                'search': message.content,
                'search_key': userRecord.query,
                'result': urlList
            };
            HistoryQuery.create(data);
        } else {
            updateData = {
                'result': urlList,
                'search_count': history.search_count + 1
            };
            HistoryQuery.update(history._id, updateData, (err, history) => {
                if (history) {
                    return history;
                }
                else {
                    return err;
                }
            });
        }
    });
}
