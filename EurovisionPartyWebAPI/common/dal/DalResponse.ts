export class DalResponse {
    public result: any;
    public success: boolean;
    public errorMessage: string;
    public errorCode: number;

    constructor(result: any, success: boolean, errorMessage?: string, errorCode?: number) {
        this.result = result;
        this.success = success;
        this.errorMessage = errorMessage || null;
        this.errorCode = errorCode || null;
    };
}