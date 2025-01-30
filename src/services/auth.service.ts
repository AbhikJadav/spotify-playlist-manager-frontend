import api from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    username: string;
    name: string;
}

export const authService = {
    async login(credentials: LoginCredentials) {
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
        return response.data;
    },

    async register(data: RegisterData) {
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
};
