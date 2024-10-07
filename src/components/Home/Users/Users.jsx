import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectUsers,
  selectUsersSearchTerm,
  prepareAndOpenAddUserPopup,
  deleteUser,
} from "../../../redux/slices/usersSlice";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import CreateUserPopup from "./CreateUserPopup";

const Users = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const actionsTemplate = (rowData) => (
    <div>
      <Button
      className="mr-2"
        icon="pi pi-pencil"
        onClick={() => dispatch(prepareAndOpenAddUserPopup(rowData._id))}
      />
      <Button
        icon="pi pi-trash"
        onClick={() => dispatch(deleteUser(rowData._id))}
      />
    </div>
  );

  const tableStyles = {
    backgroundColor: "#333",
    color: "#fff",
  };

  const headerStyles = {
    backgroundColor: "#444",
    color: "#fff",
  };

  return (
    <div className="">
      <CreateUserPopup />

      <div className="surface-ground px-4 pb-8 pt-4 md:px-4 lg:px-6 flex align-items-center justify-content-center flex-column">
        <div className="flex align-items-center justify-content-between w-full  flex-column md:flex-row">
          <Button
            type="button"
            label={t("addNewUser")}
            icon="pi pi-customers"
            outlined
            badgeClassName="p-badge-danger"
            className="mb-1"
            onClick={() => {
              dispatch(prepareAndOpenAddUserPopup());
            }}
          />
        </div>
        <DataTable
          style={tableStyles}
          value={users}
          className="w-full shadow-7"
          scrollable
          scrollHeight="70vh"
        >
          <Column field="name" header="Name" headerStyle={headerStyles} />
          <Column field="email" header="Email" headerStyle={headerStyles} />
          <Column field="role" header="Role" headerStyle={headerStyles} />
          <Column
            body={actionsTemplate}
            header="Actions"
            headerStyle={headerStyles}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Users;
