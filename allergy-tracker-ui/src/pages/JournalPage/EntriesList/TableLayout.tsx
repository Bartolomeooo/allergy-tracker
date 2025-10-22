import {Paper, Table, TableContainer} from '@mui/material';
import type {PropsWithChildren} from 'react';

export default function TableLayout({children}: PropsWithChildren) {
  return (
    <Paper elevation={1} sx={{borderRadius: 2}}>
      <TableContainer sx={{overflowX: 'auto'}}>
        <Table
          size="small"
          stickyHeader
          aria-label="Lista wpisów"
          sx={{width: '100%', tableLayout: 'fixed'}}
        >
          <colgroup>
            <col style={{width: '9%'}} />
            <col style={{width: '8%'}} />
            <col style={{width: '8%'}} />
            <col style={{width: '8%'}} />
            <col style={{width: '8%'}} />
            <col style={{width: '9%'}} />
            <col style={{width: '12%'}} />
            <col style={{width: '25%'}} />
            <col style={{width: '5%'}} />
          </colgroup>

          {children}
        </Table>
      </TableContainer>
    </Paper>
  );
}
