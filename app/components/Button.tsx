import type { ComponentProps, ElementType, ReactNode, ReactElement } from "react";
import { twMerge } from 'tailwind-merge';

type ButtonProps<E extends ElementType> = {
    as?: E,
    children: ReactNode,
    className?: string,
};

type Props<E extends ElementType> = ButtonProps<E> & Omit<ComponentProps<E>, keyof ButtonProps<E>>;

const Button = <E extends ElementType = 'button'>({ as, children, className, ...props }: Props<E>): ReactElement => {
    const Component = as ?? 'button';

    return (
        <Component
            className={twMerge(
                'text-slate-900 font-semibold tracking-normal',
                'inline-block border px-10 py-2 rounded',
                'border-amber-700 bg-gradient-to-t from-amber-600 to-amber-200',
                'hover:border-amber-500 hover:from-amber-500 hover:to-amber-200',
                'active:from-amber-500 active:to-amber-500 active: border-amber-500',
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
};

export default Button;