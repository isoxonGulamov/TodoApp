"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  ModalProps,
} from "@nextui-org/react";
import { PlusIcon } from "./Icons";
import { ChevronDownIcon } from "./Icons";
import { EyeIcon } from "./Icons";
import { SearchIcon } from "./Icons";
import { DeleteIcon } from "./Icons";
import { EditIcon } from "./Icons";
import { useDisclosure } from "@nextui-org/react";
import { columns, users, statusOptions } from "../../utils/data";
import { capitalize } from "../../utils/Capitalize";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateModal from "./CreateModal";
import { Users } from "@/src/types";
import EditModal from "./EditModal";
import { UserModalComponent } from "./UserModal";
import { Spinner } from "@nextui-org/react";

const fetchHero = () => {
  return fetch("https://655ef5e2879575426b443c29.mockapi.io/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  superadmin: "success",
  admin: "danger",
  customer: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "roleName", "actions", "address"];
type User = (typeof users)[0];

export default function TableComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isModal, isSetModal] = useState(false);
  const [self, setSelf] = useState<Users>();
  const [userModal, setUserModal] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchHero,
    cacheTime: 600000,
    staleTime: 30000,
  });

  const DeleteMutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(
        `https://655ef5e2879575426b443c29.mockapi.io/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        });
    },
  });
  const EditItem = (data: Users, id: number) => {
    setSelf(data);
    isSetModal(false);
    setUserModal(false);
    onOpen();
  };

  const ViewUser = (id: number, user: Users) => {
    setUserModal(true);
    setSelf(user);
    onOpen();
  };
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "contact",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = data ? [...data] : [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.roleName)
      );
    }

    return filteredUsers;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: Users, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof Users];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg" }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );

      case "roleName":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.roleName]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="warning" content="Eye user">
              <span
                onClick={() => ViewUser(user?.id, user)}
                className="text-lg items-center text-orange-400 cursor-pointer active:opacity-50"
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip color="success" content="Edit user">
              <span
                onClick={() => EditItem(user, user?.id)}
                className="text-lg items-center text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  DeleteMutation.mutate(user?.id);
                  setUserModal(false);
                }}
                className="text-lg items-center text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-[400px]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className=" sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions?.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className=" sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              onPress={onOpen}
              onClick={() => isSetModal(true)}
              color="primary"
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  if (isLoading) return (
    <div className="text-center items-center mt-[250px] mr-auto ml-auto">
      <Spinner label="Loading ..." color="success" labelColor="success" />
    </div>
  );
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isModal && !userModal  ?  (
        <CreateModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      ) : (
        ""
      )}
      {!isModal && !userModal ? (
        <EditModal
          isOpen={isOpen}
          self={self}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      ) : (
        ""
      )}

      {userModal ? (
        <UserModalComponent
          isOpen={isOpen}
          self={self}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      ) : (
        ""
      )}
    </>
  );
}
