import Nav from '../components/nav'

export default function IndexPage() {
  return (
    <div className="bg-black w-full h-screen text-gray-500 flex flex-col px-6 pb-6">
      <Nav />
      <div className="flex-grow text-center">
        You see a maze of twisty passages, all the same.
      </div>
      <div className="w-full text-lg border-solid border-white border-2 rounded-lg p-1">
        <textarea className="repl w-full bg-black bg-opacity-0 text-3xl p-6 outline-none" autoFocus></textarea>
      </div>
    </div>
  )
}
