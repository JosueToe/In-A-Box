import Header from "./Header";

export default function HeaderStoryboard() {
  return (
    <div className="bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 min-h-screen">
      <Header />
      <div className="pt-24 px-4 text-white text-center">
        <h1 className="text-3xl font-bold">Content Area</h1>
        <p className="mt-4">Scroll down to see the header change</p>
      </div>
    </div>
  );
}
