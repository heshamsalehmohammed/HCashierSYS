// components/UserSessions/UserSessions.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersSessions,
  selectUsers,
  terminateUserSessions,
  openMasterMessagePopup,
  terminateSession,
} from "../../../redux/slices/masterUserSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import MasterMessage from "./MasterMessage";

const MasterManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    dispatch(fetchUsersSessions());
  }, [dispatch]);

  const userActionsTemplate = (rowData) => {
    const anyConnected = rowData.sessions.some((session) => session.connected);

    return (
      <div className="flex justify-content-start">
        <Button
          label={t("terminateAllUserSessions")}
          className="p-button-danger mr-2"
          onClick={() => handleTerminateAllUserSessions(rowData)}
          disabled={!anyConnected}
        />
        <Button
          label={t("sendMessageToAllUserSessions")}
          className="p-button-success"
          onClick={() => handleSendMessageToAllUserSessions(rowData)}
          disabled={!anyConnected}
        />
      </div>
    );
  };

  const sessionActionsTemplate = (rowData) => {
    return (
      <div className="flex justify-content-start">
        <Button
          label={t("terminateSession")}
          className="p-button-danger mr-2"
          onClick={() => handleTerminateSession(rowData.sessionId)}
          disabled={!rowData.connected}
        />
        <Button
          label={t("sendMessageToSession")}
          className="p-button-success"
          onClick={() => handleSendMessageToSession(rowData.sessionId)}
          disabled={!rowData.connected}
        />
      </div>
    );
  };

  const handleTerminateAllUserSessions = (user) => {
    dispatch(terminateUserSessions(user._id));
  };

  const handleSendMessageToAllUserSessions = (user) => {
    dispatch(openMasterMessagePopup({ userId: user._id, sessionId: null }));
  };

  const handleSendBroadCastMessage = () => {
    dispatch(openMasterMessagePopup({ userId: null, sessionId: null }));
  };

  const handleTerminateSession = (sessionId) => {
    dispatch(terminateSession(sessionId));
  };

  const handleSendMessageToSession = (sessionId) => {
    dispatch(openMasterMessagePopup({ sessionId: sessionId, userId: null }));
  };

  const renderSessions = (rowData) => {
    return (
      <DataTable value={rowData.sessions} responsiveLayout="scroll">
        <Column field="sessionId" header={t("sessionId")}></Column>
        <Column
          field="connected"
          header={t("connected")}
          body={(data) => (data.connected ? t("connected") : t("disconnected"))}
        ></Column>
        <Column header={t("actions")} body={sessionActionsTemplate}></Column>
      </DataTable>
    );
  };

  return (
    <div className="">
      <MasterMessage />

      <div className="surface-ground px-4 pb-8 pt-4 md:px-6 lg:px-8 flex align-items-center justify-content-center flex-column">
        <div className="flex align-items-center justify-content-between w-full  flex-column md:flex-row">
          <Button
            label={t("sendBroadCast")}
            className="p-button-success mb-3"
            onClick={() => handleSendBroadCastMessage()}
          />
        </div>
        <DataTable
          value={users}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={renderSessions}
          dataKey="_id"
          className="w-12 m-auto shadow-7"
          emptyMessage={t("noAvailableRecords")}
          scrollable
          scrollHeight="70vh"
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="name" header={t("name")}></Column>
          <Column header={t("actions")} body={userActionsTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default MasterManagement;
