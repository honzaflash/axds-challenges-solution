import React, { useEffect, useState } from "react";
import { ParseResult } from 'papaparse';
import { usePapaParse } from 'react-papaparse';
import { Grid, Typography, Paper } from "@mui/material";
import DataGrid, { GridColDef } from "./DataGrid";

const COLUMN_CONFIG: GridColDef[] = [
  { field: 'time', headerName: 'Time', sortFunc: (a, b) => new Date(a).valueOf() - new Date(b).valueOf() },
  { field: 'humidity', headerName: 'Humidity' },
  { field: 'salinity', headerName: 'Salinity' },
  { field: 'air_temperature', headerName: 'Air temperature' },
  { field: 'water_temperature', headerName: 'Water temperature' },
  { field: 'wind_speed', headerName: 'Wind speed' },
]

interface DataTableProps {}

const DataTable: React.FC<DataTableProps> = () => {

  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);

  const { readRemoteFile } = usePapaParse();

  // Load data on component mount
  useEffect(() => {
    readRemoteFile(window.location.href + '/data.csv', {
      worker: true,
      header: true,
      download: true,
      complete: (results: ParseResult<Record<string, string>>) => {
        setCsvData(results.data);
        console.log("CSV Data Loaded!")
      }
    });
  }, [readRemoteFile, setCsvData]);

  return (
    <Grid container direction="column">
      <Paper style={{ padding: 25, marginBottom: 75 }}>

        <Typography variant="h3" align="center">
          Data Table
        </Typography>

        <Typography paragraph component="div">
          This exercise is add features to the Data Table below:
          <ul>
            <li>
              <b>Autoload:</b> Instead of using the "Load CSV Data" button to
              populate the data table, populate the table without any manual
              intervention or clicking.
            </li>
            <li>
              <b>Pagination:</b> This data table should support pagination
              so the entire table isn't shown in a single table.
            </li>
            <li>
              <b>Column Sorting:</b> Clicking on a column header should sort the
              table by that column.
            </li>
            <li>
              <b>Styling:</b> Style this data table so it looks more appealing. Feel free to use
              the `style` prop on the components (as seen in this code) or completely
              replace the UI libraries. It is up to you.
            </li>
          </ul>
        </Typography>

        <Typography paragraph component="div">
          You are free to change this application in any way to implement the features above.
          You may add additional dependencies to this project and load the CSV data differently
          if you would like.
        </Typography>

        <Typography paragraph component="div">
          <DataGrid rawData={csvData} columnConfig={COLUMN_CONFIG} />
        </Typography>

      </Paper>
    </Grid>
  );

};

export default DataTable;
