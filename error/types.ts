export type ApiFetchMeta = {
	action?: string;
	body?: string | null;
	status?: number;
	statusText?: string;
};

export type ApiErrorRequest = {
	apiFetch?: ApiFetchMeta;
	headers?: Headers | Array< [ string, string ] > | Record< string, string >;
	status?: number;
};

export type ApiError = {
	code?: string | number;
	data?: any;
	message?: string;
	request?: ApiErrorRequest;
	jsonData?: any;
};

export type ErrorLike = ApiError | Error | string | Record< string, any >;
