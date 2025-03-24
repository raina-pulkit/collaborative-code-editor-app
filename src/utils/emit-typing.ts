import { ACTIONS } from '@/constants/actions';
import { Socket } from 'socket.io-client';

export const handleEmitTyping = async (
  socketRef: React.RefObject<Socket | null>,
  id: string,
  userId: string,
) => {
  if (!socketRef || !socketRef.current) return;

  // emit typing event
  socketRef.current.emit(ACTIONS.TYPING, { id, userId });
};
