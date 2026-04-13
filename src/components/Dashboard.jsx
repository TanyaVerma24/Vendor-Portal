  import { useEffect, useState, useRef } from "react";
  import { DataTable } from "primereact/datatable";
  import { Column } from "primereact/column";
  import { Rating } from "primereact/rating";
  import { Tag } from "primereact/tag";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Colors,
  } from "chart.js";
  import { Bar, Pie } from "react-chartjs-2";
  import { registerables } from "chart.js";
  ChartJS.register(...registerables);
  import { Dialog } from "primereact/dialog";
  import Input from "./Input";
  import { Dropdown } from "primereact/dropdown";
  import { Toast } from "primereact/toast";
  import { COLORS } from "../utils/Color";

  export default function Dashboard() {
    const [vendor, setVendor] = useState([]);
    const [vendorDialog, setVendorDialog] = useState(false);
    const [vendorName, setVendorName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [riskLevel, setRiskLevel] = useState([]);
    const [selectedRisk, setSelectedRisk] = useState("");
    const [spend, setSpend] = useState("");
    const [rating, setRating] = useState("");
    const [error, setError] = useState({});

    const toast = useRef(null);
    //get data of vendor
    async function getVendors() {
      const response = await fetch("http://localhost:5000/vendors");

      const data = await response.json();

      console.log(data);
      setVendor(data);
      const typeList = data.map((v) => v.category);
      const uniqueType = [...new Set(typeList)];

      const categoryFormat = uniqueType.map((cat) => ({
        label: cat,
        value: cat,
      }));

      setCategory(categoryFormat);

      const riskList = data.map((v) => v.riskLevel);
      const uniqueRisk = [...new Set(riskList)];
      {
        console.log("------------->>", uniqueRisk);
      }
      const riskFormat = uniqueRisk.map((risk) => ({
        label: risk,
        value: risk,
      }));
      setRiskLevel(riskFormat);
    }

    useEffect(() => {
      getVendors();
    }, []);
    const validate = () => {
      let newError = {};
      if (vendorName.trim() === "") {
        newError.vendorName = "Vendor Name is required";
      }
      if (email.trim() === "") {
        newError.email = "Email is required";
      }
      if (!selectedCategory) {
        newError.category = "Category is required";
      }
      if (!selectedRisk) {
        newError.level = "Risk Level is required";
      }
      setError(newError);
      return Object.keys(newError).length === 0;
    };
    const handleFormSubmit = () => {
      const isValid = validate();
      if (!isValid) return;
      addVendor();
      console.log("form submitted successfully");
    };
    const clearForm = () => {
      setVendorName("");
      setEmail("");
      setSelectedCategory("");
      setSelectedRisk("");
      setSpend("");
      setRating("");
    };
    const addVendor = async () => {
      const payload = {
        name: vendorName,
        contactEmail: email,
        category: selectedCategory,
        status: "Active",
        rating: rating,
        spend: `₹${spend}`,
        riskLevel: selectedRisk,
      };
      try {
        const response = await fetch("http://localhost:5000/vendors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const savedVendor = await response.json();
          setVendor([...vendor, savedVendor]);
          setVendorDialog(false);
          clearForm();

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Vendor Added Successfully!",
            life: 3000,
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong!",
          life: 3000,
        });
      }
    };

    const [search, setSearch] = useState("");

    //search data
    const filteredVendors = vendor.filter((item) => {
      return item?.name?.toLowerCase()?.includes(search.toLowerCase());
    });
    {
      console.log("---", vendor);
    }

    const activeCount = vendor.filter((v) => {
      return v.status === "Active";
    }).length;

    const inactiveCount = vendor.length - activeCount;
    const underReviewCount = vendor.length - (activeCount + inactiveCount);

    const ratingBodyTemplate = (vendor) => {
      return <Rating value={vendor.rating} readOnly cancel={false} />;
    };
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

    const pieData = {
      labels: ["Active", "Inactive"],
      datasets: [
        {
          data: [activeCount, inactiveCount],
          backgroundColor: [COLORS.green, COLORS.red],
          hoverOffset: 4,
        },
      ],
    };
    console.log(
      "Sabka Kharcha:",
      vendor.map((v) => v.spend),
    );
    const topVendors = [...vendor]
      .map((v) => {
        const spendValue = parseInt(
          String(v.spend || "0").replace(/[₹,]/g, "") || 0,
        );
        return { ...v, numericSpend: spendValue };
      })

      .sort((a, b) => b.numericSpend - a.numericSpend)

      .slice(0, 10);
    const barData = {
      labels: topVendors.map((v) => v.name),
      datasets: [
        {
          label: "Top 10 Spends (₹)",
          data: topVendors.map((v) => v.numericSpend),
          backgroundColor: "#00b7ffff",
          borderRadius: 5,
        },
      ],
    };
    return (
      <div className="flex-1 p-10">
        <Toast ref={toast} />
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Vendor Overview</h1>

          <button
            onClick={() => {
              setVendorDialog(true);
            }}
            className="btn-active"
          >
            + Add Vendor
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div className="  bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border-l-8 border-black">
            <p className="text-gray-500 text-sm font-bold uppercase">
              Total Vendors
            </p>
            <h2 className="text-3xl font-black">{vendor.length}</h2>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border-l-8 "
            style={{ borderLeftColor: COLORS.green }}
          >
            <p className="text-gray-500 text-sm font-bold uppercase">Active</p>
            <h2 className="text-3xl font-black " style={{ color: COLORS.green }}>
              {activeCount}
            </h2>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border-l-8"
            style={{ borderLeftColor: COLORS.red }}
          >
            <p className="text-gray-500 text-sm font-bold uppercase">Inactive</p>
            <h2 className="text-3xl font-black " style={{ color: COLORS.red }}>
              {inactiveCount}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg border-l-8 " style={{ borderLeftColor: COLORS.blue }}>
            <p className="text-gray-500 text-sm font-bold uppercase">
              Under Review
            </p>
            <h2 className="text-3xl font-black" style={{ color: COLORS.blue }}>
              {underReviewCount}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 self-start">
              Vendor Status Ratio
            </h3>
            <div className="w-full max-w-[300px]">
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: true,
                  responsive: true,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg ">
            <h3 className="text-lg font-bold mb-4">Vendor Spend (INR)</h3>
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: true,
                responsive: true,
              }}
            />
          </div>
        </div>
        <input
          className="bg-gray-200 px-4 py-2 rounded-lg outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-sm w-64"
          type="text"
          value={search}
          placeholder="🔍 Search Vendors..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataTable
          paginator
          rows={5}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[5, 10, 15]}
          value={filteredVendors}
          paginatorLeft
          className="my-project-table mt-3"
        >
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
          <Column
            header="Rating"
            body={ratingBodyTemplate}
            style={{ width: "20%" }}
          ></Column>
        </DataTable>
        <Dialog
          onHide={() => {
            setVendorDialog(false);
            clearForm();
          }}
          visible={vendorDialog}
          maskClassName="backdrop-blur-sm bg-black/40"
          header="Add Vendor"
          style={{ width: "50%" }}
        >
          <Input
            label="Vendor Name"
            type="text"
            value={vendorName}
            id="vendor_name"
            onChange={(val) => {
              setVendorName(val);
              setError((prev) => ({
                ...prev,
                vendorName: "",
              }));
            }}
          ></Input>
          {error.vendorName && (
            <span style={{ color: "red" }}> {error.vendorName}</span>
          )}
          <Input
            label="Vendor Email"
            type="email"
            value={email}
            onChange={(val) => {
              setEmail(val);

              setError((prev) => ({
                ...prev,
                email: "",
              }));
            }}
            id="email"
          ></Input>
          {error.email && <span style={{ color: "red" }}> {error.email}</span>}
          <div className="flex flex-col mt-1">
            <label className="font-bold " htmlFor="type_input">
              Category
            </label>

            <Dropdown
              inputId="type_input"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.value);
                setError((prev) => ({
                  ...prev,
                  category: "",
                }));
              }}
              options={category}
              pt={{
                root: {
                  className:
                    " mt-1 w-full text-black max-w-[400px] border-2 border-gray-300 rounded-md focus-within:!border-blue-700 !shadow-none",
                },
                input: {
                  className: "text-black p-3",
                },
                panel: {
                  className:
                    "bg-white  border-2 border-gray-200 shadow-xl rounded-lg mt-1",
                },
              }}
            ></Dropdown>
            {error.category && (
              <span style={{ color: "red" }}> {error.category}</span>
            )}

            <div className="flex flex-col mt-1">
              <label htmlFor="risk_level" className="font-bold">
                {" "}
                Risk Level
              </label>
              <Dropdown
                id="risk_level"
                value={selectedRisk}
                options={riskLevel}
                onChange={(e) => {
                  setSelectedRisk(e.value);
                  setError((prev) => ({
                    ...prev,
                    level: "",
                  }));
                }}
                pt={{
                  root: {
                    className:
                      " mt-1 w-full text-black max-w-[400px] border-2 border-gray-300 rounded-md focus-within:!border-blue-700 !shadow-none",
                  },
                  input: {
                    className: "text-black p-3",
                  },
                  panel: {
                    className:
                      "bg-white  border-2 border-gray-200 shadow-xl rounded-lg mt-1",
                  },
                }}
              ></Dropdown>
              {error.level && (
                <span style={{ color: "red" }}> {error.level}</span>
              )}
            </div>

            <Input
              label="Total Spend (₹)"
              value={spend}
              placeholder="₹"
              onChange={setSpend}
              type="number"
              id="spend"
            ></Input>
            <div className="mt-1">
              <label className="font-bold" htmlFor="rating">
                Rating
              </label>
              <div className="border-2 border-grey-300 rounded-md py-2 px-2 w-full max-w-[400px]">
                {" "}
                <Rating
                  className="mt-1"
                  value={rating}
                  onChange={(e) => {
                    setRating(e.value);
                  }}
                ></Rating>
              </div>
            </div>
          </div>

          <div className="flex gap-7">
            <button className="btn-active mt-3" onClick={handleFormSubmit}>
              Add{" "}
            </button>
            <span
              onClick={() => {
                setVendorDialog(false);
                setError({});
                clearForm();
              }}
              className="mt-5 cursor-pointer"
            >
              {" "}
              Cancel
            </span>
          </div>
        </Dialog>
      </div>
    );
  }
