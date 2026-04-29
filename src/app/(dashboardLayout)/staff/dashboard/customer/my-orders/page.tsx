import MyOrders from '@/components/dashboard/my-orders/MyOrders'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders | Farin Fusion',
  description: 'View and manage your orders on Farin Fusion.',
}

export default function MyOrdersPage() {
  return <MyOrders />
}
