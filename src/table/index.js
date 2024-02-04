import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faQuestionCircle,
  faSpinner,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./table.css";
import dayjs from "dayjs";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalDroidCount, setTotalDroidCount] = useState(0);
  const [totalHumanCount, setTotalHumanCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Birth Year",
        accessor: "birth_year",
      },
      {
        Header: "Eye Color",
        accessor: "eye_color",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Hair Color",
        accessor: "hair_color",
      },
      {
        Header: "Skin Color",
        accessor: "skin_color",
      },
      {
        Header: "Height",
        accessor: "height",
      },
      {
        Header: "Mass",
        accessor: "mass",
      },
      {
        Header: "Created",
        Cell: ({ row }) => dayjs(row.original.created).format("DD/MM/YYYY"),
      },
      {
        Header: "Edited",
        Cell: ({ row }) => dayjs(row.original.edited).format("DD/MM/YYYY"),
      },
      {
        Header: "Icon",
        accessor: "icon",
        Cell: ({ row }) => {
          switch (row.original.gender) {
            case "n/a":
              return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M420.6 301.9a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m273.7-144.5 47.9-83a10 10 0 1 0 -17.3-10h0l-48.5 84.1a301.3 301.3 0 0 0 -246.6 0L116.2 64.5a10 10 0 1 0 -17.3 10h0l47.9 83C64.5 202.2 8.2 285.6 0 384H576c-8.2-98.5-64.5-181.8-146.9-226.6" />
                </svg>
              );
            case "male":
            case "female":
              return <FontAwesomeIcon icon={faUserCircle} />;
            default:
              return <FontAwesomeIcon icon={faQuestionCircle} />;
          }
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      pageIndex,
    },
    useSortBy,
    usePagination
  );

  const changePage = (number) => {
    setPageIndex((state) => state + number);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearching(true);

        const response = await axios.get(
          `https://swapi.dev/api/people/?search=${searchQuery}&page=${
            pageIndex + 1
          }`
        );
        const droids = response.data.results.filter(
          ({ gender }) => gender === "n/a"
        );

        setData(response.data.results);
        setTotalCount(response.data.count);
        setTotalDroidCount(droids.length);
        setTotalHumanCount(response.data.results.length - droids.length);
        setSearching(false);
      } catch (error) {
        setError(error.message);
        setSearching(false);
      }
    };

    fetchData();
  }, [searchQuery, pageIndex]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-5">
      <div class="flex gap-5 w-full md:w-1/2">
        <form class="flex items-center">
          <label for="simple-search" class="sr-only">
            Search
          </label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              id="simple-search"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search"
              required=""
            />
          </div>
        </form>
        <button
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={() => setSearchQuery("")}
        >
          Clear Search
        </button>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md w-full h-32 bg-red-200 flex flex-col justify-center items-center space-y-2 text-gray-700 font-semibold">
            <span className="text-lg">Total Result</span>
            <span className="text-xl">{totalCount}</span>
          </div>
          <div className="border border-gray-200 rounded-md w-full h-32 bg-green-200 flex flex-col justify-center items-center space-y-2 text-gray-700 font-semibold">
            <span className="text-lg">Total Droid</span>
            <span className="text-xl">{totalDroidCount}</span>
          </div>
          <div className="border border-gray-200 rounded-md w-full h-32 bg-blue-200 flex flex-col justify-center items-center space-y-2 text-gray-700 font-semibold">
            <span className="text-lg">Total Human</span>
            <span className="text-xl">{totalHumanCount}</span>
          </div>
        </div>
      </div>
      <table
        {...getTableProps()}
        className="table-auto w-full border border-gray-200 rounded-md"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {searching && <FontAwesomeIcon icon={faSpinner} spin />}
      {data.length === 0 && !searching && (
        <div>
          <FontAwesomeIcon icon={faWarning} />
          No results found.
        </div>
      )}
      <nav
        class="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
        aria-label="Table navigation"
      >
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing page
          <span class="font-semibold text-gray-900 dark:text-white">
            {" "}
            {pageIndex + 1}{" "}
          </span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">
            {" "}
            {Math.ceil(totalCount / pageSize)}
          </span>
        </span>
        <ul class="inline-flex items-stretch -space-x-px">
          <li>
            <div
              onClick={() => changePage(-1)}
              disabled={pageIndex === 0}
              class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </li>
          <li>
            <div
              onClick={() => changePage(1)}
              disabled={pageIndex === Math.ceil(totalCount / pageSize) - 1}
              class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Next</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TableComponent;
