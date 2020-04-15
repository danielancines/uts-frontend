import { IUser } from 'app/manager/users/user.model';
import { IPokerRoom } from 'app/manager/poker-rooms/poker-room.model';

export interface IDailyBalance {
    _id: string;
    user: IUser;
    gamesCount: number;
    date: Date;
    firstRegistration: string;
    lastRegistration: string;
    balances: [{
        pokerRoom: IPokerRoom,
        value: number
    }]
}