import Navbar from "../../components/adminNav/AdminNavbar"
import OrderManagement from "../order-manage/Order-management"
import ContactManagement from "../contact-manage/Contact-management"

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-amber-950 text-amber-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      <main className="flex-1 overflow-auto px-2 sm:px-4 pt-20 pb-8 max-w-7xl mx-auto w-full space-y-12">
        <OrderManagement />
        <ContactManagement />
      </main>
    </div>
  )
}
