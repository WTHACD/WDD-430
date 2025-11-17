import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const invoice = await fetchInvoiceById(params.id);
  const customers = await fetchCustomers();
  return <EditInvoiceForm invoice={invoice} customers={customers} />;
}
