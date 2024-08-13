import Link from 'next/link'
import React from 'react'
import { Icons } from '../icons'
import { siteConfig } from '@/config/site'
import { NavItem } from '@/types/nav'
import { cn } from '@/lib/utils'

interface MainNavProps {
    items?: NavItem[]
}

const MainNav = ({ items }: MainNavProps) => {
    return (
        <>
            <div className="flex gap-6 md:gap-10">
                <Link href="/" className="flex items-center space-x-2">
                    <Icons.logo className="h-6 w-6" />
                    <span className="inline-block font-bold">{siteConfig.name}</span>
                </Link>
            </div>
            <div>
                {items?.length ? (
                    <nav className="flex flex-1 gap-6">
                        {items?.map(
                            (item, index) =>
                                item.href && (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center text-sm font-medium text-muted-foreground",
                                            item.disabled && "cursor-not-allowed opacity-80"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                )
                        )}
                    </nav>
                ) : null}
            </div>
        </>
    )
}

export default MainNav