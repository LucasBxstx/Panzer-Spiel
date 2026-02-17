import { Socket } from 'socket.io';

export function extractTokenFromHandshake(client: Socket): string | null {
  const token = client.handshake?.auth?.token;
  if (token) return token;

  const authHeader = client.handshake?.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return client.handshake?.query?.token as string;
}
