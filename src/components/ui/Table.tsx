import React from "react";

interface Column<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export const Table: React.FC<TableProps> = ({ data, columns, }) => {
console.log(data)
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-3 gap-4 md:grid-cols-2 `}>
      {data.map((row, index) => (
        <div
          key={index}
          className="bg-white  w-full shadow-2xl border  rounded-lg p-4 hover:shadow-md transition"
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex  justify-between items-center py-2 border-b last:border-b-0"
            >
              <span className="font-medium text-gray-600 mr-1">{column.label}</span>
              <span className="text-gray-800  overflow-x-auto">
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
