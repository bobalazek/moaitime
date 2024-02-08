import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateOrganizationSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

// Types
export type Organization = z.infer<typeof OrganizationSchema>;

export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;

export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
