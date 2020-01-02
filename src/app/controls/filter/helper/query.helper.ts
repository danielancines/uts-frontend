import { IFilterOption } from "../model/option.model";
import * as _ from "lodash";
import { HttpParams } from "@angular/common/http";

export class QueryHelper {
    optionsToQueryParams(options: IFilterOption[]): HttpParams {
        let httpParams: HttpParams = new HttpParams();
        _.forEach(options, o=> {
            httpParams = httpParams.append(o.query.operation, o.query.value)
        });

        return httpParams;
    }
}