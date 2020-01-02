import { IUser } from 'app/manager/users/user.model';
import { IPokerRoom } from 'app/manager/poker-rooms/poker-room.model';

export interface IMoneyRequest {
    _id: string;
    user: IUser;
    pokerRoom: IPokerRoom;
    value: number;
    date: Date;
    status: number;
    details: string;
}