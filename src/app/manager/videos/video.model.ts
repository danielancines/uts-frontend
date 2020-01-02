import { ICategory } from "../categories/category.model";
import { IGroup } from "../groups/group.model";
import { IUser } from "../users/user.model";

export interface IVideo {
    _id: string;
    name: string;    
    url: string;
    duration: number;
    description: string;
    category: ICategory;
    group: IGroup;
    date: Date;
    instructor: IUser;
    details: string;
}
