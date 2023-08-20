/**
 * Represents a result that can be successful (Ok) or contain an error (Err).
 */
export type Result<T> = Ok<T> | Err<T>;

/**
 * Represents a successful result containing a value of type T.
 */
class Ok<T> {
	/**
	 * Constructs an Ok result containing the given value.
	 * @param value - The value contained in the result.
	 */
	public constructor(public readonly value: T) {}

	/**
	 * Checks if the result is of type Ok.
	 * @returns True if the result is of type Ok, otherwise false.
	 */
	public isOk(): this is Ok<T> {
		return true;
	}

	/**
	 * Checks if the result is of type Err.
	 * @returns False, as the result is of type Ok.
	 */
	public isErr(): this is Err<T> {
		return false;
	}
}

/**
 * Represents an error result containing an error message.
 */
class Err<T> {
	/**
	 * Constructs an Err result containing the given error.
	 * @param error - The error contained in the result.
	 */
	public constructor(public readonly error: Error) {
		console.log(error);
	}

	/**
	 * Checks if the result is of type Ok.
	 * @returns False, as the result is of type Err.
	 */
	public isOk(): this is Ok<T> {
		return false;
	}

	/**
	 * Checks if the result is of type Err.
	 * @returns True if the result is of type Err, otherwise false.
	 */
	public isErr(): this is Err<T> {
		return true;
	}
}

/**
 * Construct a new Ok result value.
 * @param value - The value to be wrapped in an Ok result.
 * @returns An Ok result containing the given value.
 */
export const ok = <T>(value: T): Ok<T> => new Ok(value);

/**
 * Construct a new Err result value.
 * @param error - The error message or Error object to be wrapped in an Err result.
 * @returns An Err result containing the given error.
 */
export const err = <T>(error: Error | string): Err<T> => {
	if (typeof error === 'string') {
		return new Err(new Error(error));
	}
	return new Err(error);
};
