'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, Package, FileText, ShoppingCart, User, BarChart3 } from 'lucide-react';

export function SupplierSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className={`bg-white border-r shadow-sm transition-all duration-300 h-screen ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 w-full flex justify-center md:justify-start"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        <Link href="/supplier/dashboard" className="flex items-center p-3 rounded-lg hover:bg-gray-100 group">
          <LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className={`${isOpen ? 'block' : 'hidden'} group-hover:block`}>Dashboard</span>
        </Link>
        
        <div className={`${isOpen ? 'block' : 'hidden'} ml-2`}>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">Products</div>
          <Link href="/supplier/products/add" className="flex items-center p-2 rounded hover:bg-blue-50 text-blue-600">
            <Package className="h-4 w-4 mr-2" />
            Add Products
          </Link>
          <Link href="/supplier/products" className="flex items-center p-2 rounded hover:bg-gray-50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Products
          </Link>
          <Link href="/supplier/products/inventory" className="flex items-center p-2 rounded hover:bg-gray-50">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </Link>
          <Link href="/supplier/products/ordersreceived" className="flex items-center p-2 rounded hover:bg-gray-50">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders Received
          </Link>
          <Link href="/supplier/products/invoices" className="flex items-center p-2 rounded hover:bg-gray-50">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </Link>
          <Link href="/supplier/products/profile" className="flex items-center p-2 rounded hover:bg-gray-50">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
