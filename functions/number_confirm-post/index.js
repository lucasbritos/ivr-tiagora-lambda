const VoiceResponse = require('twilio').twiml.VoiceResponse;
const qs = require("querystring")

exports.handler = async (event) => {
  return new Promise((resolve)=>{
    const voiceResponse = new VoiceResponse();
    const customer = event.queryParams
    const from = event.data.From;
    const digit = event.data.Digits;
    const numero = digit || from
    customer.contact = numero
    const gather = voiceResponse.gather({
        action: 'number_change?'+qs.stringify(customer),
        method: 'POST',
        numDigits: '1'
    });
    gather.say(
        'El teléfono registrado es ' + numero.split("").join(", ") + 
        '. Presione 1 para confirmar, si desea modificarlo presione 2.',
        {voice: 'alice', language: 'es-MX'}
    );
    //gather.pause({length:2})
    voiceResponse.redirect('number_confirm?'+qs.stringify(customer))
    resolve({body:voiceResponse.toString()})
  })
};

