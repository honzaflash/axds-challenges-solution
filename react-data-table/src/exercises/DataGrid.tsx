import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useState } from 'react';


type comparationFunc = (a: any, b: any) => number

export interface GridColDef {
  field: string
  headerName: string
  width?: number
  sortFunc?: comparationFunc
};

interface TableProps {
  rawData: any[]
  columnConfig: GridColDef[]
};

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100];
const INIT_PAGINATION = {
  page: 0,
  pageSize: 10,
};

const DataGrid = ({ rawData, columnConfig }: TableProps) => {
  // add an id  
  const data = rawData.map((row, i) => ({ id: i, ...row }))
  // sort
  const [sortBy, setSortBy] = useState<string | comparationFunc>()
  if (sortBy) {
    data.sort(typeof sortBy === 'function' ? sortBy : (a, b) => a[sortBy] - b[sortBy])
  } 
  // paginate
  const [{page, pageSize}, setPagination] = useState(INIT_PAGINATION)
  const paginated = data.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columnConfig.map(({ headerName, field, sortFunc }) => (
              <TableCell
                key={field}
                onClick={() => setSortBy(sortFunc ?? field)}
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                {headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((row) => (
            <TableRow key={row.id}>
              {columnConfig.map(({ field }) => (
                <TableCell key={field}>{row[field]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={100}
        page={page}
        onPageChange={(_e, page) => setPagination((prev) => ({...prev, page }))}
        rowsPerPage={pageSize}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        onRowsPerPageChange={(e) => {setPagination((prev) => ({page: 0, pageSize: parseInt(e.target.value) }))}}
      />
    </TableContainer>
  )
};

export default DataGrid;
