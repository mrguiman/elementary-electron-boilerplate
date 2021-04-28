export default class MessageData<T = unknown> {
  type: string;
  value: T;

  constructor(type: string, value: T) {
    this.type = type;
    this.value = value;
  }
}
