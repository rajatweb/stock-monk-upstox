"use client";

import { useState } from "react";
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"


const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
];

interface ISearchScriptProps {
    onScriptAdded: (...arg: any) => void
}

export const SearchScript = ({
    onScriptAdded
}: ISearchScriptProps) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const handleOpen = () => {
        setOpen((open) => !open)
    }
    return (
        <Command className="border rounded-none">
            <CommandInput placeholder="Type a command or search..." onValueChange={handleOpen} />
            <CommandList>
                {open && (
                    <>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {frameworks.map((framework) => (
                            <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    onScriptAdded(currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {framework.label}
                            </CommandItem>
                        ))}
                    </>
                )}

            </CommandList>
        </Command>
    )
}

