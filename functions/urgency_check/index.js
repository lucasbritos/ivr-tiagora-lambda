var AWS = require('aws-sdk');

const credentials = require('./credentials.json')
const twilioCredentials = credentials.twilio;
AWS.config.credentials = credentials.aws;
AWS.config.update({ region: credentials.aws.region })
var ddb = new AWS.DynamoDB.DocumentClient();
const client = require('twilio')(twilioCredentials.accountSid, twilioCredentials.authToken);

exports.handler = async (event) => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'ivr-customers',
            FilterExpression: 'urgency = :true',
            ExpressionAttributeValues: { ':true': true }
        };
        ddb.scan(params, async function  (err, data) {
            if (err) return console.log("Error", err);
            let iter = data.Items
            if (iter.length === 0) return resolve("Nothing to do /-()-/")
            console.log(iter);
            let pos;
            let phones;
            let from;
            for (let i of iter) {
                pos = i.phoneAgent_posLastCalled;
                phones = i.phoneAgent
                from = twilioCredentials.number
                await saveLog(phones[pos],i.cod)
                await changePostion(i.cod,nextItem(pos,phones.length))
                await makeCall(from,phones[pos],i.cod)
            }
            resolve(phones[pos])
        });
    });
};

const makeCall = async (from, to, cod) => {
    //return Promise.resolve()
    return new Promise((resolve, reject) => {
        client.calls.create({
            url: credentials.twilio.endpoint + "?cod=" + cod,
            to: to,
            from: from
        }, (err, call) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

const changePostion = async (cod, nextPosition) => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'ivr-customers',
            Key: { cod: parseInt(cod) },
            UpdateExpression: 'set phoneAgent_posLastCalled = :x ',
            ExpressionAttributeValues: { ':x': nextPosition }
        };
        ddb.update(params, function (err, data) {
            if (err) { return reject(err) }
            resolve()
        })
    })
}


const saveLog = async (to, cod) => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'ivr-call-logs',
            Item: {
                timestamp: new Date().toISOString(),
                to: to,
                cod: parseInt(cod),
                type: "call"
            }
        };
        ddb.put(params, function (err, data) {
            if (err) return reject(err)
            resolve()
        })
    })
}

const nextItem = (pos, length) => {
    return ((pos == (length - 1)) ? 0 : pos + 1);
}