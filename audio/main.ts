import EmitSoundEvent from '../types/EmitSoundEvent';
import MessageData from '../types/MessageData';

import * as el from '@nick-thompson/elementary';

declare const global: any;
const core: el.Core = global.elementary.core;

process.on('message', (rawMessage: MessageData) => {
  switch (rawMessage.type) {
    case 'emit-sound':
      emitSound(rawMessage.value as EmitSoundEvent);
      break;
    default:
      stopSound();
      break;
  }
});
core.on('load', () => {
  console.log('elementary Core Loaded');
});

function emitSound(event: EmitSoundEvent) {
  console.log(`Emitting ${event.frequency}hz at gain ${event.gain}`);
  renderTone(event.gain, event.frequency);
  process.send!(new MessageData('update', event));
}
function stopSound() {
  renderTone(0, 0);
  process.send!(new MessageData('update', new EmitSoundEvent(0, 0)));
}

function renderTone(gain: number, frequency: number) {
  return core.render(
    el.mul(el.const({ key: 'jahzGate', value: gain }), el.cycle(el.const({ key: 'jahzFreq', value: frequency })))
  );
}
