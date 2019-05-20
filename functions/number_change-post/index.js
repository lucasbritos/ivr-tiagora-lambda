const VoiceResponse = require('twilio').twiml.VoiceResponse;
const qs = require("querystring")

exports.handler = async (event) => {
  const customer = event.queryParams
  const digit = event.data.Digits;
  const optionActions = {
    '1': createCase(customer),
    '2': askNumber(customer)
  };
    
  return (optionActions[digit]) ? optionActions[digit] :  invalidOption(customer);
};

function createCase(customer) {
  const voiceResponse = new VoiceResponse();
  voiceResponse.redirect('create_case?'+qs.stringify(customer))
  return {body:voiceResponse.toString()}
}

function askNumber(customer) {
  const voiceResponse = new VoiceResponse();
  const gather = voiceResponse.gather({
    action: 'number_confirm?'+qs.stringify(customer),
    method: 'POST',
  });

  gather.say( 'Ingrese el nuevo número y luego presione numeral', {voice: 'alice', language: 'es-MX'});
  gather.pause({length:2})
  voiceResponse.redirect('number_confirm?'+qs.stringify(customer))
  return({body:voiceResponse.toString()})
}

function invalidOption(customer) {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say('Opción inválida ',{voice: 'alice', language: 'es-MX'});
  voiceResponse.redirect('number_confirm?'+qs.stringify(customer))
  return {body:voiceResponse.toString()}
}
