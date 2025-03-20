'use client';

import AdminMiddleware from '@/middlewares/adminMiddleware';

export default function AdminFieldsLayout({ children }) {
  return (
    <AdminMiddleware>
      {children}
    </AdminMiddleware>
  );
}