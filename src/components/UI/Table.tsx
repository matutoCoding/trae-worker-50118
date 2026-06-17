import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export default function Table({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

Table.Header = function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('text-xs text-slate-500 uppercase bg-slate-50', className)}>
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

Table.Body = function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={cn('divide-y divide-slate-100', className)}>{children}</tbody>;
};

interface TableRowProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

Table.Row = function TableRow({ children, className, hover = true, onClick }: TableRowProps) {
  return (
    <tr
      className={cn(
        hover && 'hover:bg-slate-50 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

Table.Head = function TableHead({ children, className }: TableHeadProps) {
  return (
    <th scope="col" className={cn('px-6 py-3 font-medium whitespace-nowrap', className)}>
      {children}
    </th>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

Table.Cell = function TableCell({ children, className }: TableCellProps) {
  return <td className={cn('px-6 py-4 whitespace-nowrap text-slate-700', className)}>{children}</td>;
};
