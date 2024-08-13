import { ScrollArea } from '@/components/ui/scroll-area';

interface IWatchListProps {
    handleWatchListSelect: (...args: any) => void
}

export const WatchList = ({
    handleWatchListSelect
}: IWatchListProps) => {

    return (
        <ScrollArea className="h-[900px]">
            <nav className="grid gap-1 px-2 py-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {/* {watchlist.map((list, idx) => (
                    <a
                        onClick={() => handleWatchListSelect(list.idxname)}
                        key={list.token}
                        className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file mr-2 h-4 w-4">
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        </svg>
                        {list.idxname}
                        <span className="ml-auto">#{list.token}</span>
                    </a>
                ))} */}

                <a
                    onClick={() => handleWatchListSelect({
                        instrument_key: "NSE_INDEX|Nifty 50",
                        expiry_date: "2024-08-08"
                    })}
                    className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file mr-2 h-4 w-4">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    </svg>
                    Nifty 50
                    <span className="ml-auto">17</span>
                </a>
                <a
                    onClick={() => handleWatchListSelect({
                        instrument_key: "NSE_INDEX|Nifty Bank",
                        // instrument_key: "NSE_FO|Nifty 50",
                        expiry_date: "2024-08-07"
                    })}
                    className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file mr-2 h-4 w-4">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    </svg>
                    Nifty Bank
                    <span className="ml-auto">28</span>
                </a>
            </nav>
        </ScrollArea>
    )
}
