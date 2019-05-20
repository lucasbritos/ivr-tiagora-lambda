const credentials = require('./credentials.json')
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var vogels = require('vogels');
var Joi = require('joi');
vogels.AWS.config = credentials.aws;
const qs = require("querystring")


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
  return new Promise((resolve)=>{
    const twiml = new VoiceResponse();
    const digit = event.data.Digits;
    Customer.get(parseInt(digit), function (err, c) {
        if (!c || err) {
            return resolve(invalidCode())
        }
        const customer = {
          name: c.attrs.name,
          token: c.attrs.token,
          user: c.attrs.user,
          cod: c.attrs.cod
        }
        twiml.say('Su requerimiento está siendo creado. '+
        'A continuación, le solicitaremos información de contacto.'
        ,{voice: 'alice', language: 'es-MX'})
        twiml.redirect('number_confirm?'+qs.stringify(customer));
        resolve({body:twiml.toString()})
      }); 
  })
};


function invalidCode() {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say('Código inválido   ',{voice: 'alice', language: 'es-MX'});
  voiceResponse.redirect('welcome')
  return {body:voiceResponse.toString()}
}

