/* Error de Validacion */
import { AppError } from "./app-error";

export class Validation extends AppError {
	constructor(message: string = "Validation"){
		super(message, 400);
	}
}
