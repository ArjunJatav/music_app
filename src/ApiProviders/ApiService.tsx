import ApiClient from './ApiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class ApiService {
  static async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<T> {
    try {
      const response = await ApiClient({
        method,
        url: endpoint,
        data,
        headers,
      });
      return response.data;
     
      
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static post<T>(endpoint: string, data: any, headers: Record<string, string> = {}) {
    return this.request<T>('POST', endpoint, data, headers);
  }

  static get<T>(endpoint: string, headers: Record<string, string> = {}) {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  static put<T>(endpoint: string, data: any, headers: Record<string, string> = {}) {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  static delete<T>(endpoint: string, headers: Record<string, string> = {}) {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  private static handleError(error: any): { message: string } {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessages: Record<number, string> = {
        400: data.message || 'Bad Request',
        401: 'Unauthorized. Please log in again.',
        403: 'Forbidden. Access denied.',
        404: 'Resource not found.',
        409: 'Conflict detected. Please check your input.',
        500: 'Internal Server Error. Try again later.',
        503: 'Service Unavailable. Please try later.',
      };

      return { message: errorMessages[status] || data.message || 'An unknown error occurred.' };
    }

    return { message: error.request ? 'No response from server. Check your network.' : error.message || 'Request failed.' };
  }
}

export default ApiService;
