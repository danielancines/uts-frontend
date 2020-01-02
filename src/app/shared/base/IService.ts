import { Observable } from "rxjs";

export interface IService{
    get(queryString: string): Observable<{ count: number, data: any[] }>;
}