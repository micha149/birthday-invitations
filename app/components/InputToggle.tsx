import type { ComponentProps, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

type InputToggleProps = {
    className?: string,
    label: string,
    disabled?: boolean,
}

type Props = InputToggleProps & Omit<ComponentProps<'input'>, (keyof InputToggleProps | 'type')>;

export default function InputToggle({ label, className, disabled, ...props }: Props): ReactElement {
    return (
        <label
            className={twMerge(
                'relative inline-flex items-center bg-slate-700 px-4 py-2',
                !disabled && 'cursor-pointer active:bg-slate-500 hover:bg-slate-600',
                disabled && 'bg-slate-900',
                className
            )}
        >
            <span className="font-medium mr-auto">{label}</span>
            <input type="checkbox" className="sr-only peer" disabled={disabled} {...props} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-lime-400 hidden peer-checked:block w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-rose-400 peer-checked:hidden w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </label>
    );
}