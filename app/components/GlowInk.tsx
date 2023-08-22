import type { ComponentProps, ElementType, ReactNode, ReactElement } from "react";
import { twMerge } from 'tailwind-merge';

type GlowInkProps<E extends ElementType> = {
    as?: E,
    children: ReactNode,
    className?: string,
};

type Props<E extends ElementType> = GlowInkProps<E> & Omit<ComponentProps<E>, keyof GlowInkProps<E>>;

const GlowInk = <E extends ElementType = 'p'>({ as, children, className, ...props }: Props<E>): ReactElement => {
    const Component = as ?? 'p';

    return (
        <Component className={twMerge('font-handwriting text-6xl text-amber-50 [text-shadow:_0_0px_30px_var(--tw-shadow-color),_0_0px_10px_var(--tw-shadow-color)] shadow-amber-200', className)} {...props}>
            {children}
        </Component>
    )
};

export default GlowInk;