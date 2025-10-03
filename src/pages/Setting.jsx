import Sidebar from "../components/Nav";

export default function Setting() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">Your dashboard content</div>
    </div>
  );
}
