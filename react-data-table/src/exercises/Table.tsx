import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'


interface TableProps {
  rawData: any[]
  columnConfig: GridColDef[]
};

const Table = ({rawData, columnConfig}: TableProps) => {
  
  const data = rawData.map((row, i) => ({id: i, ...row}))
  return (
    <DataGrid
      rows={data}
      columns={columnConfig}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      sx={{
        [`.${gridClasses.columnHeaderTitle}`]: {
          fontWeight: 600,
        },
      }}
    />
  )
};

export default Table;
