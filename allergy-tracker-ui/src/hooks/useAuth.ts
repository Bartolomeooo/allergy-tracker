import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {isAxiosError} from 'axios';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {api, tokenStore} from '../api/client';
import type {LoginResponse} from '../types/auth/loginResponse';
import type {RegisterResponse} from '../types/auth/registerResponse';
import type {MeResponse} from '../types/auth/meResponse';
import {PATHS} from '../router/paths';

type ApiError = {message?: string; code?: string};

type JwtPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

function decodeToken(token: string): MeResponse | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      user: {
        id: decoded.sub,
        email: decoded.email,
      },
    };
  } catch {
    return null;
  }
}

export function fetchMe(): MeResponse | null {
  const token = tokenStore.get();
  if (!token) return null;
  return decodeToken(token);
}

export function useMe() {
  const hasToken = !!tokenStore.get();

  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: hasToken,
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (body: {email: string; password: string}) => {
      const {data} = await api.post<LoginResponse>('/auth/login', body);
      return data;
    },
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      tokenStore.set(data.accessToken);
      qc.setQueryData(['me'], decodeToken(data.accessToken));
      void nav(PATHS.journal, {replace: true});
    },
    onError: (err) => {
      setErrorMessage(getLoginErrorMessage(err));
    },
  });

  return {
    ...mutation,
    errorMessage,
  };
}

export function useRegister() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (body: {email: string; password: string}) => {
      const {data} = await api.post<RegisterResponse>('/auth/register', body);
      return data;
    },
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      tokenStore.set(data.accessToken);
      qc.setQueryData(['me'], decodeToken(data.accessToken));
      void nav(PATHS.journal, {replace: true});
    },
    onError: (err) => {
      setErrorMessage(getRegisterErrorMessage(err));
    },
  });

  return {
    ...mutation,
    errorMessage,
  };
}

export function useLogout() {
  const qc = useQueryClient();
  const nav = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout', {});
    },
    onSettled: () => {
      tokenStore.clear();
      qc.clear();
      void nav(PATHS.login, {replace: true});
    },
  });
}

function getLoginErrorMessage(err: unknown): string {
  if (isAxiosError<ApiError>(err)) {
    const status = err.response?.status;
    const msg = err.response?.data?.message;

    if (status === 401) {
      return 'Nieprawidłowy email lub hasło.';
    }
    if (status === 400) {
      return 'Nieprawidłowe dane logowania.';
    }
    if (msg) {
      return msg;
    }
  }
  return 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
}

function getRegisterErrorMessage(err: unknown): string {
  if (isAxiosError<ApiError>(err)) {
    const status = err.response?.status;
    const msg = err.response?.data?.message;

    if (status === 409) {
      return 'Podany adres e-mail jest już zajęty.';
    }
    if (status === 400) {
      return 'Nieprawidłowe dane rejestracji.';
    }
    if (msg) {
      return msg;
    }
  }
  return 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.';
}
