const credentials = require('./credentials.json')
const VoiceResponse = require('twilio').twiml.VoiceResponse;
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
  const customer = event.queryParams
  const voiceResponse = new VoiceResponse();
  const to = event.data.To
  const cod = customer.cod

  await saveLog(to,cod)
  await resetUrgency(cod)
  voiceResponse.say("Recepción confirmada. Muchas gracias.",{voice: 'alice', language: 'es-MX'})
  voiceResponse.hangup()
  return {body:voiceResponse.toString()}

};

let saveLog = (to,cod)=>{
  return new Promise((resolve,reject)=>{
    let call = {
      to: to,
      cod: cod,
      timestamp: new Date().toISOString(),
      type: "Confirmation"
    }
    Call.create(call, function (err, call) {
      if (err) return reject(err)
      resolve(call)
    });
  })
}

const resetUrgency = async (cod) => {
  return new Promise((resolve,reject)=>{
      Customer.update({cod:parseInt(cod),phoneAgent_posLastCalled:0,urgency:false}, function (err, res) {
          if (err) { return reject(err) }
          resolve(res)
        })
  })
}