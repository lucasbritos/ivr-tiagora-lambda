const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.handler = async (event) => {
  const digit = event.data.Digits;
  const optionActions = {
    '1': urgentCase(digit)
  };
  
return (optionActions[digit]) ? optionActions[digit] :  invalidOption();
};


function urgentCase() {
  const voiceResponse = new VoiceResponse();
    const gather = voiceResponse.gather({
      action: 'customer',
      method: 'POST',
    });
      
  gather.say('Ingrese su código de cliente y presione numeral.   ',{voice: 'alice', language: 'es-MX'});
  return {body:voiceResponse.toString()}
}

function invalidOption() {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say('Opción inválida   ',{voice: 'alice', language: 'es-MX'});
  voiceResponse.redirect('welcome')
  return {body:voiceResponse.toString()}
}
