import { React, useRef, useState } from "react";
import Card from "./Card";
import { useVendors } from "../Context/VendorContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { COLORS } from "../utils/Color";
import { OverlayPanel } from "primereact/overlaypanel";

function Vendors() {
  const { vendor, setvendor, loading } = useVendors();
  const [expandedRows, setExpandedRows] = useState(null);
  const [search, setSearch] = useState("");
  const op = useRef(null);

  const statusBadge = (vendor) => {
    return (
      <Tag
        style={{
          backgroundColor:
            vendor.status?.trim() === "Active"
              ? COLORS.green
              : vendor.status === "Under_Review"
                ? COLORS.blue
                : COLORS.red,
        }}
        value={vendor.status}
      ></Tag>
    );
  };
  console.log("vendor------------", vendor);
  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-4  row-expansion-animate bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <h5 className="font-bold text-lg mb-3">
          Detailed Information: {data.name}
        </h5>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <strong>Last Order :</strong> {data.lastOrder || "N/A"}
          </div>
          <div>
            <strong>Total Spend:</strong> {data.spend}
          </div>
          <div>
            {" "}
            <strong>Risk Level:</strong> {data.riskLevel}
          </div>
        </div>
      </div>
    );
  };
  const filteredVendors = vendor.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 p-10">
      <OverlayPanel ref={op}>
        <div>hI</div>
      </OverlayPanel>
      <h1 className="text-3xl font-bold text-gray-800">Vendor Directory</h1>
      <Card title="Manage Vendors">
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="search vendors 🔍"
            className=" mt-3 bg-gray-200 px-4 py-2 rounded-lg outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-sm w-80"
          ></input>
          <i
            className="fa-solid fa-filter mt-6"
            onClick={(e) => op.current.toggle(e)}
            style={{ color: "rgb(4,4,4)" }}
          ></i>
        </div>
        <DataTable
          loading={loading}
          stripedRows
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[5, 10, 15]}
          paginatorLeft
          className=" mt-3"
          value={filteredVendors || []}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
        >
          <Column expander style={{ width: "5rem" }} />
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="name"
            header="Vendor Name"
            sortable
            style={{ width: "40%" }}
          ></Column>
          <Column
            field="contactEmail"
            header="Email"
            style={{ width: "30%" }}
          ></Column>
          <Column
            field="category"
            style={{ width: "30%" }}
            header="Category"
          ></Column>
          <Column
            header="Status"
            body={statusBadge}
            style={{ width: "30%" }}
          ></Column>
        </DataTable>
      </Card>
    </div>
  );
}

export default Vendors;
