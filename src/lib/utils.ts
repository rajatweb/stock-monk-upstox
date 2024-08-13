import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as crypto from 'crypto';
import { IUser } from "@/types/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getHash = (input: string) =>
  crypto.createHash('sha256').update(input).digest('hex');

interface ISetAppLocalStorageProps {
  name: string;
  payload: IUser;
}

export const setAppLocalStorage = ({
  name,
  payload
}: ISetAppLocalStorageProps) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(name, JSON.stringify(payload));
  } else {
    return;
  }
}

export const getAppLocalStorageByName = (name: ISetAppLocalStorageProps["name"]) => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(name) || '{}')
  }
}

export const timeToLocal = (originalTime: any) => {
  const d = new Date(originalTime);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}
