import { User } from './member-profile/user';

export interface Room {
  id: string;
  ownerUuid: string;
  owner: User;
  isPrivate: boolean;
  invitedUsers: User[];
  lastLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateRoomDto {
  id?: string;
  ownerUuid: string;
  isPrivate: boolean;
  invitedUsers: string[];
  lastLanguage: string;
}

export interface GetRoomsDto {
  ownerUuids?: string[];
  roomId?: string;
  invitedUserUuids?: string[];
}

export type UpdateRoomDto = Partial<Room>;
