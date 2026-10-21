"use client";

import CosmosisLoader from "../../loading/CosmosisLoader";
import { useDashboardPageLoading } from "../../loading/DashboardPageLoading";

export default function GenericTableLoader() {
  const managed = useDashboardPageLoading(true);
  return (
    <div className="generic-table-loader" aria-hidden={managed ? true : undefined}>
      {!managed && <CosmosisLoader />}
    </div>
  );
}
