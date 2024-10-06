import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import "primeflex/primeflex.css";
import {
  selectInitializedOrdersCount,
  selectInitializedOrdersCountPercent,
  selectMostSoldStockItem,
  selectNewlyAddedUsersCount,
  selectDaysOptions,
  selectNewlyAddedUsersCountPercent,
  selectSelectedMostSoldStockItemOption,
  setSelectedMostSoldStockItemOption,
  selectSelectedNewlyAddedUsersCountOption,
  setSelectedNewlyAddedUsersCountOption,
  fetchStats,
} from "../../../redux/slices/statisticsSlice";
import "./Stat.scss";
import OrdersItemsPreparationCard from "../Order/OrdersItemsPreparationCard";
import { useTranslation } from "react-i18next";

const Stat = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const initializedOrdersCount = useSelector(selectInitializedOrdersCount);
  const initializedOrdersCountPercent = useSelector(selectInitializedOrdersCountPercent);
  const mostSoldStockItem = useSelector(selectMostSoldStockItem);
  const selectedMostSoldStockItemOption = useSelector(selectSelectedMostSoldStockItemOption);
  const newlyAddedUsersCount = useSelector(selectNewlyAddedUsersCount);
  const newlyAddedUsersCountPercent = useSelector(selectNewlyAddedUsersCountPercent);
  const selectedNewlyAddedUsersCountOption = useSelector(selectSelectedNewlyAddedUsersCountOption);
  const daysOptions = useSelector(selectDaysOptions);

  useEffect(() => {
    dispatch(fetchStats());
  }, []);

  const handleMostSoldStockItemOChange = (e) => {
    dispatch(setSelectedMostSoldStockItemOption(e.value));
  };

  const handleNewlyAddedUsersCountChange = (e) => {
    dispatch(setSelectedNewlyAddedUsersCountOption(e.value));
  };

  return (
    <div className="flex flex-column h-full">
      <div className="grid">
        <div className="col-12 md:col-7 lg:col-4">
          <Card title={t("initializedOrders")} className="shadow-7 stat-card" style={{minHeight:'240px',height:'240px'}}>
            <div className="flex justify-content-between align-items-start mt-3 p-2">
              <div className="w-6">
                <span className="text-4xl font-bold text-900">
                  {initializedOrdersCount}
                </span>
                <div className="text-green-500">
                  <span className="font-medium">
                    + {initializedOrdersCountPercent} %
                  </span>
                  <i className="pi pi-arrow-up text-xs ml-2"></i>
                </div>
              </div>
              <div className="w-6">
                <svg
                  width="100%"
                  viewBox="0 0 258 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 93.9506L4.5641 94.3162C8.12821 94.6817 15.2564 95.4128 22.3846 89.6451C29.5128 83.8774 36.641 71.6109 43.7692 64.4063C50.8974 57.2018 58.0256 55.0592 65.1538 58.9268C72.2821 62.7945 79.4103 72.6725 86.5385 73.5441C93.6667 74.4157 100.795 66.2809 107.923 65.9287C115.051 65.5765 122.179 73.0068 129.308 66.8232C136.436 60.6396 143.564 40.8422 150.692 27.9257C157.821 15.0093 164.949 8.97393 172.077 6.43766C179.205 3.9014 186.333 4.86425 193.462 12.0629C200.59 19.2616 207.718 32.696 214.846 31.0487C221.974 29.4014 229.103 12.6723 236.231 5.64525C243.359 -1.38178 250.487 1.29325 254.051 2.63076L257.615 3.96827"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-7 lg:col-4">
          <Card title={t("mostSoldStockItem")} className="shadow-7 stat-card" style={{minHeight:'240px',height:'240px'}}>
            <Dropdown
              value={selectedMostSoldStockItemOption}
              options={daysOptions}
              onChange={handleMostSoldStockItemOChange}
              placeholder={t("selectDays")}
              className="p-mb-2"
            />
            <div className="flex justify-content-between align-items-start mt-3 p-2">
              <div className="w-7 flex">
                <div className="flex">
                  <span className="text-4xl font-bold text-900 mr-1">
                    {mostSoldStockItem}
                  </span>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                </div>
              </div>
              <div className="w-6 -mt-4">
                <svg
                  width="100%"
                  viewBox="0 0 258 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 93.9506L4.5641 94.3162C8.12821 94.6817 15.2564 95.4128 22.3846 89.6451C29.5128 83.8774 36.641 71.6109 43.7692 64.4063C50.8974 57.2018 58.0256 55.0592 65.1538 58.9268C72.2821 62.7945 79.4103 72.6725 86.5385 73.5441C93.6667 74.4157 100.795 66.2809 107.923 65.9287C115.051 65.5765 122.179 73.0068 129.308 66.8232C136.436 60.6396 143.564 40.8422 150.692 27.9257C157.821 15.0093 164.949 8.97393 172.077 6.43766C179.205 3.9014 186.333 4.86425 193.462 12.0629C200.59 19.2616 207.718 32.696 214.846 31.0487C221.974 29.4014 229.103 12.6723 236.231 5.64525C243.359 -1.38178 250.487 1.29325 254.051 2.63076L257.615 3.96827"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-7 lg:col-4">
          <Card title={t("newlyAddedUsers")} className="shadow-7 stat-card" style={{minHeight:'240px',height:'240px'}}>
            <Dropdown
              value={selectedNewlyAddedUsersCountOption}
              options={daysOptions}
              onChange={handleNewlyAddedUsersCountChange}
              placeholder={t("selectDays")}
              className="p-mb-2"
            />
            <div className="flex justify-content-between align-items-start mt-3 p-2">
              <div className="w-6">
                <span className="text-4xl font-bold text-900">
                  {newlyAddedUsersCount}
                </span>
                <div className="text-green-500">
                  <span className="font-medium">
                    + {newlyAddedUsersCountPercent} %
                  </span>
                  <i className="pi pi-arrow-up text-xs ml-2"></i>
                </div>
              </div>
              <div className="w-6 -mt-4">
                <svg
                  width="100%"
                  viewBox="0 0 258 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 93.9506L4.5641 94.3162C8.12821 94.6817 15.2564 95.4128 22.3846 89.6451C29.5128 83.8774 36.641 71.6109 43.7692 64.4063C50.8974 57.2018 58.0256 55.0592 65.1538 58.9268C72.2821 62.7945 79.4103 72.6725 86.5385 73.5441C93.6667 74.4157 100.795 66.2809 107.923 65.9287C115.051 65.5765 122.179 73.0068 129.308 66.8232C136.436 60.6396 143.564 40.8422 150.692 27.9257C157.821 15.0093 164.949 8.97393 172.077 6.43766C179.205 3.9014 186.333 4.86425 193.462 12.0629C200.59 19.2616 207.718 32.696 214.846 31.0487C221.974 29.4014 229.103 12.6723 236.231 5.64525C243.359 -1.38178 250.487 1.29325 254.051 2.63076L257.615 3.96827"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid">
        <div className="col" style={{ flexGrow: 1 }}>
          <OrdersItemsPreparationCard />
        </div>
      </div>
    </div>
  );
};

export default Stat;
