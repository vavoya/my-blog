export type ErrorResponse =
    | { status: 400 ; message: string }
    | { status: 401 ; message: string }
    | { status: 403; message: string }
    | { status: 404; message: string }
    | { status: 408; message: string }
    | { status: 409; message: string }
    | { status: 500; message: string };

export type Response<T> =
    | { status: 200; data: T }
    | ErrorResponse;