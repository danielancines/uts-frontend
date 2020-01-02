export class IFilterOption {
    name: string;
    query: {
        operation: string;
        value: string;
    };
    identificator: string;
    isSelected: boolean;
}