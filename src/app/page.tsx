import Image from "next/image";
import TableComponent from "./components/TableComponent";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <main className="flex h-full flex-col  justify-between ">
      <div >
        <TableComponent />
      </div>
    </main>
  );
}
