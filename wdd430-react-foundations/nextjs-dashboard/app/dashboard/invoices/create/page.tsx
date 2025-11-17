import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/invoices/create-form';

export default async function CreateInvoicePage() {
  const customers = await fetchCustomers();
  return <Form customers={customers} />;
}
