const VoiceResponse = require('twilio').twiml.VoiceResponse;
const qs = require("querystring")

exports.handler = async (event) => {
  const voiceResponse = new VoiceResponse();
  const customer = event.queryParams
  const gather = voiceResponse.gather({
      action: 'agent_confirm?'+qs.stringify(customer),
      numDigits: '1',
      method: 'POST',
  });
  gather.say(
      'Este es un mensaje automático de soporte Tiágora. ' +
      'Un cliente ha abierto un caso urgente que necesita atención inmediata.   ' +
      'Diríjase al sitio soporte punto tiágora punto com. Presione cualquier número para confirmar recepción. Muchas Gracias.           ', 
      {loop: 3,voice: 'alice', language: 'es-MX'},
  );
return {body:voiceResponse.toString()}

};
