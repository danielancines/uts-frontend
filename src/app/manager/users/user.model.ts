import { IAddress } from './address.model';
import { IGroup } from "../groups/group.model";
import { IRole } from "../roles/role.model";
import { IUserPokerRoom } from './user-poker-room.model';

export interface IUser {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    avatarHash: string;
    token: string;
    roles: Array<IRole>;
    groups: Array<IGroup>;
    active: boolean;
    rg: string;
    cpf: string;
    phone: string;
    phone1: string;
    dealPercentage: number;
    addresses: Array<IAddress>;
    pokerRooms: Array<IUserPokerRoom>;
    canInformValueAtMoneyRequest: boolean;
}
