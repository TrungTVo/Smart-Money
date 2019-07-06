import * as React from 'react';
import {currencyTypes} from '../dictionary/dictionary';
import {
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  SelectionState
} from '@devexpress/dx-react-grid';

import {
  Grid, Table,
  TableHeaderRow, PagingPanel,
  SearchPanel, Toolbar,
  TableSelection
} from '@devexpress/dx-react-grid-bootstrap4';

import {connect} from 'react-redux';
import { loadTransactions } from '../actions/transactionActions';
import ModalDelete from '../common/ModalDelete';
import ModalAdd from '../common/ModalAdd';
import ModalEdit from '../common/ModalEdit';
import {numberWithCommas} from '../utils/Utils';
import * as actions from '../actions/types';

//import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

/*
==================================================================
Currency formatter
==================================================================
*/


var ACCOUNT_CURRENCY = '';

const PaymentFormatter = (props) => {
  const { value} = props;
  return (
    <b style={{ color: value >= 0 ? 'green' : 'red' }}>
      {value >= 0 ? '+' : '-'}<small>{ACCOUNT_CURRENCY === 'USD' ? currencyTypes.USD : (ACCOUNT_CURRENCY === 'VND' ? currencyTypes.VND : currencyTypes.EUR)}</small>{numberWithCommas(Math.abs(value))}
    </b>
  );
}

const PaymentTypeProvider = props => {
  const { account_currency} = props;
  ACCOUNT_CURRENCY = account_currency;
  return (
    <DataTypeProvider
      formatterComponent={PaymentFormatter}
      {...props}
    />
  );
}

/*
==================================================================
Dates formatter
==================================================================
*/
const DateFormatter = (props) => {
  const { row } = props;
  const { date } = row;
  
  return (
    <span >
      {date}
    </span>
  )
}

const DateTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    {...props}
  />
);

/*
==================================================================
Notes formatter
==================================================================
*/
const NotesFormatter = (props) => {
  const { row } = props;
  const { notes } = row;
  
  return (
    <small>
      {notes}
    </small>
  );
}

const NotesTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={NotesFormatter}
    {...props}
  />
);

/*
==================================================================
Table styles
==================================================================
*/
const TableComponent = ({ ...restProps }) => {
  return (
    <Table.Table
      {...restProps}
      // className="table-striped"
    />
  )
}

const getRowId = row => row.id;

/**
 * ==================================================================
 * Command button styles
 * ==================================================================
 */

const SortingIcon = ({ direction }) => (
  <span
    className={`fas fa-arrow-${direction === 'asc' ? 'up' : 'down'}`}
  />
);

const SortLabel = ({ onSort, children, direction }) => {
  return (
    <span
      className="font-weight-bold"
      onClick={onSort}
      style={{cursor: 'pointer' }}
    >
      {children}
      {(direction && <SortingIcon direction={direction} />)}
      {children.props.children === 'Date' ? <div><small>(yyyy/mm/dd)</small></div> : null}
    </span>
  );
}

/**
 * ===================================================
 * TABLE TOOLBAR
 * ===================================================
 */
const toolBarComponent = ({children}) => {
  return <div className='bg-light p-3 border-0'>
    {children}
  </div>
}

/**
 * ===================================================
 * TABLE CELLS
 * ===================================================
 */

const Cell = (props) => {
  return <Table.Cell {...props} style={{ verticalAlign: 'middle' }} className='p-2' />;
};

const HeaderStyles = (props) => {
  return <TableHeaderRow.Cell {...props} style={{ verticalAlign: 'middle' }} />
}


class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      //fixedColumn: window.innerWidth > 945,
      loading: true,
      columns: [
        { name: 'date', title: `Date` },
        { name: 'amount', title: 'Amount' },
        { name: 'category', title: 'Category' },
        { name: 'notes', title: 'Notes' },
        { name: 'payee', title: 'Payee' }
      ],
      tableColumnExtensions: [
        { columnName: 'date', align: 'center', width: 110 },
        { columnName: 'amount', align: 'right', width: 110 },
        { columnName: 'category', align: 'right', width: 100 },
        { columnName: 'notes', align: 'center', wordWrapEnabled: true, width: 350 },
        { columnName: 'payee', align: 'left', width: 110 },
      ],
      rows: []
        // {
        //   id: 1,
        //   date: '2019/09/14',
        //   amount: 450,
        //   category: 'Bills for electric',
        //   currency: 'VND',
        //   notes: '',
        //   payee: 'Trung Vo',
        // }
      ,
      sorting: [{columnName: 'date', direction: 'desc'}],
      paymentColumns: ['amount'],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 20, 30],
      searchValue: '',
      //leftFixedColumns: [TableEditColumn.COLUMN_TYPE],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      selection: [],
      selected_row: {}
    };
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeSearchValue = value => this.setState({ searchValue: value });
    this.changeSorting = sorting => this.setState({ sorting });
  }


  componentDidMount() {
    const {account } = this.props;
    this.props.loadTransactions(account._id);
  }

  componentWillReceiveProps(nextProps) {
    const {transactions} = nextProps;
    transactions.transactions.forEach((transaction, i) => {
      transaction.id = i + 1;
    })
    this.setState({
      rows: transactions.transactions,
      loading: false
    })
  }

  // change selection row
  changeSelection = (selection) => {
    const lastSelected = selection
      .find(selected => this.state.selection.indexOf(selected) === -1);
    
    const selected_row = this.state.rows.find(row => row.id === lastSelected);
    this.setState({
      selected_row: selected_row
    })

    if (lastSelected !== undefined) {
      this.setState({ selection: [lastSelected] });
    } else {
      this.setState({ selection: [] });
    }
  }


  render() {
    const { 
      loading, columns, tableColumnExtensions, searchValue, sorting,
      paymentColumns, pageSize, pageSizes, currentPage,
      selection, selected_row
    } = this.state;

    const {account, transactions} = this.props;
    var balance = typeof transactions.account !== 'undefined' && transactions.account !== null ? transactions.account.balance : '';
    ACCOUNT_CURRENCY = account.currency;

    //var balance = accounts.account.name === account.name ? accounts.account.balance : account.balance;

    return (
      <div className="card">
        {
          loading ? 
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div> : null
        }
          <div>
            <div className='font-weight-bold bg-primary text-white p-3 border-0' style={{ display: 'flex', alignItems: 'center' }}>
              Current balance: <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{currencyTypes[ACCOUNT_CURRENCY]}{numberWithCommas(balance)}
            </div>
            <Grid
              rows={this.state.rows}
              columns={columns}
              getRowId={getRowId}
            >
              <SelectionState
                selection={selection}
                onSelectionChange={this.changeSelection}
              />

              {/* Paging for table */}
              <PagingState
                defaultCurrentPage={currentPage}
                onCurrentPageChange={this.changeCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={this.changePageSize}
              />
              <IntegratedPaging />
              <PagingPanel pageSizes={pageSizes} />

              {/* Currency styles formatter */}
              <PaymentTypeProvider for={paymentColumns} account_currency={account.currency} />
              <DateTypeProvider for={['date']} />
              <NotesTypeProvider for={['notes']} />

              {/* Searching tool */}
              <SearchState
                value={searchValue}
                onValueChange={this.changeSearchValue}
              />
              <IntegratedFiltering />
              <Toolbar rootComponent={toolBarComponent} />
              <SearchPanel />

              {/** Sorting tools */}
              <SortingState
                sorting={sorting}
                defaultSorting={sorting}
                onSortingChange={this.changeSorting}
              />
              <IntegratedSorting />              

              {/* Table itself */}
              <Table columnExtensions={tableColumnExtensions}
                tableComponent={TableComponent}
                cellComponent={Cell}
              />

              <TableHeaderRow showSortingControls
                sortLabelComponent={SortLabel}
                cellComponent={HeaderStyles}
              />
              <TableSelection
                selectByRowClick
                highlightRow
                showSelectionColumn={true}
              />
             
            </Grid>
        
            <div className='card card-footer border-left-0 border-right-0 border-bottom-0 d-flex flex-row'>

              <ModalAdd
                disabled={false}
                variant='light'
                styles='p-2 mr-2'
                size='sm'
                header="New transaction"
                buttonText="Add"
                cancelBtn="Close"
                yesBtn="Add"
                mainFuncBtn='Add'
                icon='fas fa-plus'
                currency={account.currency}
                bankAccount={transactions.loading ? account : transactions.account}
                auth={this.props.auth}
              />

              <ModalEdit
                disabled={selection.length > 0 ? false : true}
                variant='light'
                styles='p-2 mr-2'
                size='sm'
                header="Edit transaction"
                buttonText="Update"
                cancelBtn="Close"
                yesBtn="Update"
                mainFuncBtn='Update'
                icon='fas fa-pen'
                currency={account.currency}
                bankAccount={transactions.loading ? account : transactions.account}
                transaction={selected_row}
                after_edit={() => this.setState({ selected_row: {}, selection: []})}
              />

              <ModalDelete
                disabled={selection.length > 0 ? false : true}
                variant='light'
                styles='p-2'
                size='sm'
                type={actions.DELETE_TRANSACTION}
                header="Remove transaction"
                body="Are you sure you want to remove this transaction?"
                buttonText="Remove"
                cancelBtn="Close"
                yesBtn="Yes"
                bankAccount={transactions.loading ? account : transactions.account}
                transaction={selected_row}
                after_delete={() => this.setState({ selected_row: {}, selection: [] })}
              />
            </div>
          </div>
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  accounts: state.accounts,
  transactions: state.transactions
})

export default connect(mapStateToProps, {loadTransactions})(DataTable);