export class AppError extens Error {
	constructor(message: string, public readonly statusCode: number){
		super(message);
	}
}
