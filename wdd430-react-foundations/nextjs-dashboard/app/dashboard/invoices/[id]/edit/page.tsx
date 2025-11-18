import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  // Next's PageProps can require `params` to be a Promise in some builds.
  // Declare it as an optional Promise to satisfy the PageProps constraint.
  params?: Promise<{ id: string }>;
  // searchParams can also be provided as a Promise in certain Next build typings
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = (await params) as { id: string };
  const invoice = await fetchInvoiceById(id);

  return {
    title: `Edit Invoice ${invoice?.id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = (await params) as { id: string };
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
    if (!invoice) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}