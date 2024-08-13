import React, { useEffect, useRef, useState } from 'react';
import { IOptionChain } from '@/types/api/optionChain';
import { useGetOptionChainQuery } from '@/store/api/option-chain';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface IChainProps {
    selectedIndex: string
}

const OChain = ({
    selectedIndex
}: IChainProps) => {
    const scrollToRef = useRef<HTMLTableRowElement | null>(null);
    const { data, isLoading } = useGetOptionChainQuery(selectedIndex);
    const [instruments, setInstruments] = useState<IOptionChain[]>([]);
    const [scrollToSpot, setScrollToSpot] = useState<number>(0);

    const currentIndex = useRef(0);
    const parent = useRef(null);

    useEffect(() => {
        if (selectedIndex && data) {
            setInstruments(data.data);
            setScrollToSpot(Math.round(data.data[0].underlying_spot_price / 50) * 50);
        }
    }, [data, selectedIndex]);

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ scrollToRef.current:", scrollToRef.current)
        if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView;
        }
    }, []);

    return (
        <>
            <div className="mx-auto mt-8 max-h-[80vh] max-w-5xl resize-y overflow-y-auto rounded-lg bg-white ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
                <table className="min-w-full divide-y divide-zinc-300 dark:divide-white/10">
                    <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-800">
                        <tr className="divide-x divide-zinc-200 dark:divide-white/10">
                            <th scope="col" className="min-w-[5ch]">
                                CE
                            </th>
                            <th scope="col" className="min-w-[5ch]">
                                Strike
                            </th>
                            <th scope="col" className="min-w-[5ch]">
                                PE
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        ref={parent}
                        className="divide-y divide-zinc-200 overflow-y-auto bg-white text-zinc-900 dark:divide-white/10 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                        {instruments?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className='text-center'>No data to display.</td>
                            </tr>
                        ) : (
                            instruments.map((i, idx) => (
                                <tr
                                    ref={scrollToRef}
                                    key={idx}
                                    className="cursor-pointer divide-x divide-zinc-200 hover:bg-zinc-50 dark:divide-white/10 dark:hover:bg-zinc-800"
                                >
                                    <td
                                        className={cn(
                                            'group',
                                            '-px-4 font-medium text-center',
                                            true
                                                ? 'bg-yellow-50/50 text-yellow-800 dark:bg-stone-700/10 dark:text-yellow-400'
                                                : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
                                        )}
                                    >
                                        <div className='flex justify-center aligh-item items-center space-x-2 p-2'>
                                            <div className='space-x-2'>
                                                <Button size="sm" variant="outline">B</Button>
                                                <span className='max-w-[2vw] border-1'>{i.call_options.market_data.ask_price}</span>
                                                <Button size="sm" variant="destructive">S</Button>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td
                                        className={cn(
                                            'bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500 text-center',
                                            true
                                                ? 'cursor-pointer hover:bg-blue-100 hover:dark:bg-blue-900/50'
                                                : 'pointer-events-none'
                                        )}
                                    >
                                        {i.strike_price}
                                    </td>
                                    <td
                                        className={cn(
                                            'group',
                                            '-px-4 font-medium text-center',
                                            true
                                                ? 'bg-yellow-50/50 text-yellow-800 dark:bg-stone-700/10 dark:text-yellow-400'
                                                : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
                                        )}
                                    >
                                        <div className='flex justify-center aligh-item items-center space-x-2 p-2'>
                                            <div className='space-x-2'>
                                                <Button size="sm" variant="outline">B</Button>
                                                <span>{i.put_options.market_data.ask_price}</span>
                                                <Button size="sm" variant="destructive">S</Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default OChain