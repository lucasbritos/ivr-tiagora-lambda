const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.handler = async (event) => {
  const voiceResponse = new VoiceResponse();
  let test = event.queryParams
  const gather = voiceResponse.gather({
      action: 'menu',
      numDigits: '1',
      method: 'POST',
  });
  gather.say(
      'Gracias por comunicarse con Soporte Tiágora. ' +
      'Presione 1 por apertura de casos urgentes.  ' +
      'Para apertura de casos no urgentes, diríjase al sitio tiágora punto zendesk punto com.            ',
      {loop: 3,voice: 'alice', language: 'es-MX'},
  );
  return {body:voiceResponse.toString()}
};

