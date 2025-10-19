class BaseAPI {
  private static instance: BaseAPI;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  private constructor(
    baseUrl: string = "",
    defaultHeaders: Record<string, string> = {},
    defaultTimeout: number = 10000
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
    this.defaultTimeout = defaultTimeout;
  }

  public static getInstance(
    baseUrl?: string,
    defaultHeaders?: Record<string, string>,
    defaultTimeout?: number
  ): BaseAPI {
    if (!BaseAPI.instance) {
      BaseAPI.instance = new BaseAPI(baseUrl, defaultHeaders, defaultTimeout);
    } else if (baseUrl) {
      // Optionally allow setting base url once when first used
      BaseAPI.instance.baseUrl = baseUrl;
    }
    return BaseAPI.instance;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  public setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  public setTimeout(timeout: number) {
    this.defaultTimeout = timeout;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, string | number>,
    customHeaders?: Record<string, string>,
    signal?: AbortSignal,
    timeout?: number
  ): Promise<T> {
    let requestUrl = this.baseUrl
      ? this.baseUrl.replace(/\/$/, "") + "/" + url.replace(/^\//, "")
      : url;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      requestUrl += `?${searchParams.toString()}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...customHeaders },
      signal,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    // Create timeout controller if timeout is specified
    const timeoutMs = timeout || this.defaultTimeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Combine user signal with timeout signal
    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const response = await fetch(requestUrl, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request aborted after ${timeoutMs}ms`);
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed (${response.status}): ${errorText || response.statusText}`
      );
    }

    // Try to parse JSON; otherwise return as text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json() as Promise<T>;
    }
    // Might be empty or another type
    return response.text() as unknown as Promise<T>;
  }

  public get<T>(
    url: string,
    params?: Record<string, string | number>,
    customHeaders?: Record<string, string>,
    signal?: AbortSignal,
    timeout?: number
  ): Promise<T> {
    return this.request<T>(
      "GET",
      url,
      undefined,
      params,
      customHeaders,
      signal,
      timeout
    );
  }

  public post<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>,
    signal?: AbortSignal,
    timeout?: number
  ): Promise<T> {
    return this.request<T>(
      "POST",
      url,
      data,
      undefined,
      customHeaders,
      signal,
      timeout
    );
  }

  public put<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>,
    signal?: AbortSignal,
    timeout?: number
  ): Promise<T> {
    return this.request<T>(
      "PUT",
      url,
      data,
      undefined,
      customHeaders,
      signal,
      timeout
    );
  }

  public patch<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>,
    signal?: AbortSignal,
    timeout?: number
  ): Promise<T> {
    return this.request<T>(
      "PATCH",
      url,
      data,
      undefined,
      customHeaders,
      signal,
      timeout
    );
  }

  public delete<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>,
    signal?: AbortSignal,
    timeout?: number
  ): Promise<T> {
    return this.request<T>(
      "DELETE",
      url,
      data,
      undefined,
      customHeaders,
      signal,
      timeout
    );
  }
}

export default BaseAPI;
