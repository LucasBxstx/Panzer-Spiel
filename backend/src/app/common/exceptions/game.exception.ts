export class GameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameException';
  }
}
