import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useGetOptionChainQuery } from '@/store/api/option-chain'
import { IOptionChain } from '@/types/api/optionChain'
import OptionsMeta from './options-meta'
import { ScrollArea } from '@/components/ui/scroll-area'

interface IOptionChainProps {
    selectedIndex: string
}

const OptionChain = ({
    selectedIndex
}: IOptionChainProps) => {
    const scrollToRef = useRef<HTMLTableRowElement | null>(null);
    const [scrollToCardNum, setScrollToCardNum] = useState<number>(0);
    const [options, setOptions] = useState<IOptionChain[]>([]);
    const { data, isLoading } = useGetOptionChainQuery(selectedIndex);

    useEffect(() => {
        if (selectedIndex && data) {
            setOptions(data.data);
            const spotPrice = data.data[0].underlying_spot_price;
            setScrollToCardNum(Math.round(spotPrice / 50) * 50);
        }
    }, [data, selectedIndex]);

    useEffect(() => {
        // If `scrollToRef` points to an element, then scroll it into view.
        console.log("🚀 ~ useEffect ~ scrollToRef.current:", scrollToRef.current)
        if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView;
        }
    }, []);


    return (
        <div className="max-h-[80vh] resize-y overflow-y-auto bg-white ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
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
                <tbody className="divide-y divide-zinc-200 overflow-y-auto bg-white text-zinc-900 dark:divide-white/10 dark:bg-zinc-900 dark:text-zinc-100">
                    {isLoading && <tr><td colSpan={4} className='text-center'>No data to display.</td></tr>}
                    {!isLoading && data && options.map(
                        (option, index) => {
                            console.log(option.strike_price === scrollToCardNum)
                            const isViewPort = option.strike_price === scrollToCardNum;
                            return (
                                <tr
                                    key={index}
                                    className="divide-x divide-zinc-200 dark:divide-white/10"
                                    ref={option.strike_price === scrollToCardNum ? scrollToRef : null}
                                >
                                    <OptionsMeta meta={option.call_options} />
                                    <td

                                        className={cn(
                                            'bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500 text-center',
                                            true
                                                ? 'cursor-pointer hover:bg-blue-100 hover:dark:bg-blue-900/50'
                                                : 'pointer-events-none'
                                        )}
                                    >
                                        {/* {Math.round(option.underlying_spot_price)} */}
                                        {option.strike_price}
                                    </td>
                                    <OptionsMeta meta={option.put_options} />
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OptionChain
