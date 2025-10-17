class BaseAPI {
  private static instance: BaseAPI;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  private constructor(
    baseUrl: string = "",
    defaultHeaders: Record<string, string> = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  public static getInstance(
    baseUrl?: string,
    defaultHeaders?: Record<string, string>
  ): BaseAPI {
    if (!BaseAPI.instance) {
      BaseAPI.instance = new BaseAPI(baseUrl, defaultHeaders);
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

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, string | number>,
    customHeaders?: Record<string, string>
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
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(requestUrl, fetchOptions);

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
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("GET", url, undefined, params, customHeaders);
  }

  public post<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("POST", url, data, undefined, customHeaders);
  }

  public put<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("PUT", url, data, undefined, customHeaders);
  }

  public patch<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("PATCH", url, data, undefined, customHeaders);
  }

  public delete<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("DELETE", url, data, undefined, customHeaders);
  }
}

export default BaseAPI;
