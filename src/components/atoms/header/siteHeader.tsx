"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import MainNav from './mainNav';
import Link from 'next/link';
import UserNav from './userNav';
import ThemeToggle from '../theme/themeToggle';
import LoginModal from '../modal/login-modal';
import { useGetUserTokenMutation } from '@/store/api/user-api';
import { useActions, useAppSelector } from '@/store/hooks';
import { getAppLocalStorageByName, setAppLocalStorage } from '@/lib/utils';

const SiteHeader = () => {
  // State
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const searchCode = searchParams.get('code');


  // Redux Store
  const getUserState = useAppSelector(state => state.userData);
  const { setUserInfo } = useActions();
  const [getAccessToken] = useGetUserTokenMutation();

  useEffect(() => {
    // local storage
    const localUserInfo = getAppLocalStorageByName("userInfo");
    if (localUserInfo && localUserInfo.access_token) {
      setUserInfo(localUserInfo);
      // router.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchCode) {
      getAccessTokenFromApi(searchCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCode]);

  const getAccessTokenFromApi = async (code: string) => {
    const payload = {
      code: code,
      client_id: process.env.NEXT_PUBLIC_APP_UPSTOX_API_KEY ?? "",
      client_secret: process.env.NEXT_PUBLIC_APP_UPSTOX_API_SECRET ?? "",
      redirect_uri: process.env.NEXT_PUBLIC_APP_UPSTOX_REDIRECT_URI ?? "",
      grant_type: "authorization_code",
    };
    const response = await getAccessToken(payload).unwrap();
    setUserInfo(response);
    setAppLocalStorage({ name: "userInfo", payload: response });
    router.push('/dashboard');
  }



  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {getUserState.access_token
              ? <UserNav username={getUserState.user_name} email={getUserState.email} />
              : <>
                <Button asChild>
                  <Link href="#" onClick={() => setOpen(!open)}>Login</Link>
                </Button>
                <LoginModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  loading={open ? false : true}
                />
              </>
            }
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader