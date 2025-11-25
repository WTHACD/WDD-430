import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ProductForm from "./ProductForm";

export default async function SellerDashboard() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== 'ARTISAN') {
    return (
      <div style={{ padding: 24 }}>
        <h2>Access denied</h2>
        <p>Only artisans can access this page.</p>
      </div>
    );
  }

  const products = await prisma.product.findMany({ where: { artisanId: session.user.id } });

  return (
    <div style={{ padding: 24 }}>
      <h1>Your Inventory</h1>
      <p>Manage your handmade products.</p>

      <ProductForm />

      <div style={{ marginTop: 24 }}>
        {products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <ul>
            {products.map((p) => (
              <li key={p.id}>{p.name} — ${p.price} — stock {p.stock}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
