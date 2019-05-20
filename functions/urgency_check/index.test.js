const credentials = require('./credentials.json')
const twilioCredentials = credentials.twilio
const client = require('twilio')(twilioCredentials.accountSid, twilioCredentials.authToken);
var vogels = require('vogels');
var Joi = require('joi');
vogels.AWS.config = credentials.aws;

var Call = vogels.define('Call', {
    hashKey: 'timestamp',
    schema: {
      to: Joi.string(),
      cod: Joi.number(),
      timestamp: Joi.string(),
      type: Joi.string()
      },
    tableName: 'ivr-call-logs'
  });

var Customer = vogels.define('Customer', {
    hashKey: 'cod',
    schema: {
      name: Joi.string(),
      phoneAgent: Joi.array(),
      phoneAgent_posLastCalled: Joi.number(),
      phoneEscalation: Joi.string(),
      token: Joi.string(),
      user: Joi.string(),
      urgency: Joi.boolean()
      },
    tableName: 'ivr-customers'
  });


exports.handler = async (event) => {
    return new Promise((resolve,reject)=>{
        Customer.scan().loadAll().exec((err,data)=>{
            if (err) throw new Error(err)
            let iter = data.Items.filter(i => i.attrs.urgency == true)
            if (iter.length == []) resolve("Nothing to do /-()-/")
            let promesas = iter.map((i)=>{
                i = i.attrs
                return procesar(i)
            })
            Promise.all(promesas,(r)=>{
                resolve(r)
            })
        })
    })
};

exports.handler()

const procesar = (item) =>{   
    return new Promise(async (resolve,reject)=>{
        let pos = item.phoneAgent_posLastCalled;
        let phones = item.phoneAgent
        let from = twilioCredentials.number
        await saveLog(phones[pos],item.cod)
        await changePostion(item.cod,nextItem(pos,phones.length))
        await makeCall(from,phones[pos],item.cod)
        resolve(phones[pos])
    })
}


const makeCall = async (from,to,cod)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{console.log("Call to " + to); resolve()},200)
  })
}


const changePostion = async (cod,nextPosition) => {
    return new Promise((resolve,reject)=>{
        Customer.update({cod:parseInt(cod),phoneAgent_posLastCalled:nextPosition}, function (err, res) {
            if (err) { return reject(err) }
            resolve()
          })
    })
}


const saveLog = async (to,cod)=>{
    return new Promise((resolve,reject)=>{
      let call = {
        to: to,
        cod: cod,
        timestamp: new Date().toISOString(),
        type: "Call"
      }
      Call.create(call, function (err, acc) {
        if (err) return reject(err)
        resolve()
      });
    })
  }

const nextItem = (pos,length) => {
    return ((pos==(length-1))? 0:pos+1);
  }

