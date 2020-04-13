import { IUser } from 'app/manager/users/user.model';
import { IPokerRoom } from 'app/manager/poker-rooms/poker-room.model';

export interface IDailyBalance {
    _id: string;
    user: IUser;
    gamesCount: number;
    date: Date;
    firstRegistration: Date;
    lastRegistration: Date;
    balances: [{
        pokerRoom: IPokerRoom,
        value: number
    }]
}