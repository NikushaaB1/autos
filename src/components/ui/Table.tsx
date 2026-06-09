import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/20 backdrop-blur-md ${containerClassName}`}>
      <table className={`w-full border-collapse text-left text-sm text-slate-300 ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const Thead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => {
  return (
    <thead className={`bg-slate-900/60 border-b border-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 font-heading ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const Tbody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-slate-800/40 bg-transparent ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...props }) => {
  return (
    <tr className={`hover:bg-slate-800/20 transition-colors duration-150 group/row ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <th className={`px-6 py-4.5 font-semibold text-slate-300 border-none ${className}`} {...props}>
      {children}
    </th>
  );
};

export const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => {
  return (
    <td className={`px-6 py-4.5 text-slate-300 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
};
