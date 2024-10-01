import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { openAddUserPopupAddress } from "../../../redux/slices/usersSlice";
import CreateUserPopup from "./CreateUserPopup";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const tableStyles = {
    backgroundColor: '#333', // Dark background
    color: '#fff', // White text
};

const headerStyles = {
    backgroundColor: '#444', // Darker header background
    color: '#fff',
};

  return (
    <div className="">
      <CreateUserPopup />
      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <Button
          type="button"
          label="Add New User"
          icon="pi pi-users"
          outlined
          badgeClassName="p-badge-danger"
          className="mb-4"
          onClick={() => {
            dispatch(openAddUserPopupAddress());
          }}
        />

        <div className="m-1">Or search for existing user</div>
        <IconField iconPosition="left" className="mt-0 m-3">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText placeholder="Search by number or name" />
        </IconField>


      </div>
      <DataTable
          value={products}
          stripedRows
          className="w-12 md:w-8 m-auto -mt-5 shadow-7"
          style={tableStyles}
        >
          <Column field="phone" header="Phone" headerStyle={headerStyles} headerClassName="text-center "></Column>
          <Column field="name" header="Name" headerStyle={headerStyles}  headerClassName="text-center " ></Column>
          <Column field="actions" header="Actions" headerStyle={headerStyles}  headerClassName="text-center " ></Column>
        </DataTable>
    </div>
  );
};

export default Users;
