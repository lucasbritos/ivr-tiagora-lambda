const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.handler = async (event) => {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say( 'Ha ocurrido un error. Póngase en contacto con el adimistrador', {voice: 'alice', language: 'es-MX'} );
  voiceResponse.hangup()
  return {body:voiceResponse.toString()}
};
