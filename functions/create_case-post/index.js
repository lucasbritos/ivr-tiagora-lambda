const credentials = require('./credentials.json')
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const request = require('request');

var vogels = require('vogels');
var Joi = require('joi');
vogels.AWS.config = credentials.aws;

let zenDeskBody = {
  "request": {
      "subject": "Urgent derived from IVR",
      "priority":"High",
      "comment": {
          "body": ""
      }
  }
}

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
  const from = event.data.From;
  const voiceResponse = new VoiceResponse();

  return openCase(from,customer).then(setUrgency(customer)).then(()=>{
    voiceResponse.say("Su requerimiento ha sido creado con éxito. En lapso de 10 minutos será contactado por un operador. Muchas gracias.",{voice: 'alice', language: 'es-MX'})
    voiceResponse.hangup()
    return {body:voiceResponse.toString()}
  })    
  .catch(()=>{
    throw new Error({body:""})
  })
};

function openCase(from,customer){
  return new Promise((resolve,reject)=>{
    const auth = "Basic " + new Buffer(customer.user+ "/token:" + customer.token).toString("base64");
    zenDeskBody.request.comment.body = "From IVR:"+ "From: " + from + " Call to: " + (customer.contact)
    request(
      {
        url: credentials.zendesk.apiUrl,
        method: "POST",
        headers : { "Authorization" : auth },
        json: zenDeskBody
      },(err, res, body)=>{
        if (err || res.statusCode != 201) { return reject() }
        resolve()
    }) 
  })
}

function setUrgency(customer){
  return new Promise((resolve,reject)=>{
    Customer.update({cod:customer.cod,urgency:true}, function (err, res) {
      if (err) { return reject() }
      resolve()
    
    })
  })
}