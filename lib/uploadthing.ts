import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl ?? file.url };
    }),

  paymentSlip: f({ image: { maxFileSize: "5MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Payment slips can be uploaded by anyone (guest checkout)
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl ?? file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
