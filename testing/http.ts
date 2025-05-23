import { type Stub, stub } from "@std/testing/mock";

/**
 * Interface defining a request handler for stubbing fetch requests.
 *
 * @property matches - A function that validates if the request matches expected criteria.
 *                    Should throw an assertion error if the request doesn't match.
 * @property response - The Response object to return when the request matches.
 */
interface StubRequestHandler {
  matches: (req: Request) => void | Promise<void>;
  response: Response;
}

/**
 * Error thrown when no stub matches an incoming fetch request.
 * Provides details about the unmatched request to help with debugging.
 */
export class UnmatchedRequestError extends Error {
  request: Request;

  /**
   * Creates a new UnmatchedRequestError with details about the unmatched request.
   *
   * @param request - The Request object that wasn't matched by any stub
   */
  constructor(request: Request) {
    const method = request.method;
    const url = request.url;
    const headers = JSON.stringify(Object.fromEntries([...request.headers]));

    super(`No stub found for ${method} ${url}\nHeaders: ${headers}`);
    this.name = "UnmatchedRequestError";
    this.request = request;
  }
}

export class StubFetch {
  private stubs: Map<string, StubRequestHandler> = new Map();
  private stubFetchInstance: Stub;

  /**
   * Creates a new StubFetch instance and automatically installs it.
   * The global fetch function is replaced with the stub immediately upon creation.
   */
  constructor() {
    this.stubFetchInstance = this.install();
  }

  /**
   * Registers a new stub for handling fetch requests.
   *
   * @param stubRequestHandler - An object defining the matcher function and response
   * @returns The same StubRequestHandler for method chaining
   *
   * @example
   * ```typescript
   * stubFetch.stub({
   *   matches: (req) => {
   *     assertEquals(req.url, "https://api.example.com/data");
   *     assertEquals(req.method, "POST");
   *   },
   *   response: new Response(JSON.stringify({ result: "success" }))
   * });
   * ```
   */
  stub(stubRequestHandler: StubRequestHandler): StubRequestHandler {
    this.stubs.set(stubRequestHandler.matches.toString(), stubRequestHandler);
    return stubRequestHandler;
  }

  /**
   * Removes a previously registered stub.
   *
   * @param stubRequestHandler - The stub handler to remove
   * @returns True if the stub is no longer registered
   */
  removeStub(stubRequestHandler: StubRequestHandler): boolean {
    const matchesKey = stubRequestHandler.matches.toString();
    if (matchesKey in this.stubs) {
      return this.stubs.delete(matchesKey);
    }
    return true;
  }

  /**
   * Installs the stub in place of the global fetch function.
   * This method replaces the real fetch implementation with our stubbed version.
   *
   * @returns The created stub instance
   */
  install(): Stub {
    this.stubFetchInstance = stub(
      globalThis,
      "fetch",
      async (url: string | URL | Request, options?: RequestInit) => {
        const request = url instanceof Request
          ? url
          : new Request(url, options);

        for (const stubRequestHandler of this.stubs.values()) {
          try {
            const assertionResult = stubRequestHandler.matches(
              request.clone(),
            );

            if (assertionResult instanceof Promise) {
              await assertionResult;
            }

            return Promise.resolve(stubRequestHandler.response.clone());
          } catch (_error) {
            // This stub didn't match, continue to try the next one
          }
        }

        throw new UnmatchedRequestError(request);
      },
    );

    return this.stubFetchInstance;
  }

  /**
   * Restores the original fetch function.
   */
  restore(): void {
    if (this.stubFetchInstance) {
      this.stubFetchInstance.restore();
    }
  }
}
