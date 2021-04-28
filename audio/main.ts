import MessageData from '../types/MessageData';
import EmitToneEvent from '../types/EmitToneEvent';
const el: any = require('@nick-thompson/elementary');
const core = require('elementary-core');

process.on('message', (messageData: MessageData<EmitToneEvent>) => {
  process.send!(`Emitting ${messageData.value.frequency}hz at gain ${messageData.value.gain}`);
  core.render(
    el.mul(
      el.const({ key: 'jahzGate', value: messageData.value.gain }),
      el.cycle(el.const({ key: 'jahzFreq', value: messageData.value.frequency }))
    )
  );
});
core.on('load', () => {
  process.send!('elementary Core Loaded');
});
