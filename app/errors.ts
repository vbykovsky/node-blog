export class RequestError extends Error {
    status: number;

    constructor(message: string = "", status = 500) {
        super(message);

        this.name = "RequestError";
        this.status = status;
    }
}

export class BadRequestError extends RequestError {
    constructor(message: string = "") {
        super(message, 400);

        this.name = "BadRequestError";
    }
}

export class UnauthorizedError extends RequestError {
    constructor(message: string = "") {
        super(message, 401);

        this.name = "UnauthorizedError";
    }
}

export class NotFoundError extends RequestError {
    constructor(message: string = "") {
        super(message, 404);

        this.name = "NotFoundError";
    }
}

export class ServerInternalError extends RequestError {
    constructor(message: string = "") {
        super(message, 500);

        this.name = "ServerInternalError";
    }
}