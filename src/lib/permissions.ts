/**
 * Defined set of permissions available for Staff Roles
 */
export const ADMIN_PERMISSIONS = {
  view_dashboard: {
    key: 'view_dashboard',
    nameEn: 'View Dashboard',
    nameAr: 'عرض لوحة التحكم',
    description: 'Basic access to see the admin overview and stats',
  },
  manage_users: {
    key: 'manage_users',
    nameEn: 'Manage Users',
    nameAr: 'إدارة المستخدمين',
    description: 'View, edit, and moderate user accounts',
  },
  manage_companies: {
    key: 'manage_companies',
    nameEn: 'Manage Companies',
    nameAr: 'إدارة الشركات',
    description: 'View and manage company profiles and details',
  },
  manage_verifications: {
    key: 'manage_verifications',
    nameEn: 'Manage Verifications',
    nameAr: 'إدارة التحققات',
    description: 'Review and approve/reject company verification requests',
  },
  manage_requests: {
    key: 'manage_requests',
    nameEn: 'Manage Requests',
    nameAr: 'إدارة الطلبات',
    description: 'Moderate service requests posted by users',
  },
  manage_projects: {
    key: 'manage_projects',
    nameEn: 'Manage Projects',
    nameAr: 'إدارة المشاريع',
    description: 'View and manage active and completed projects',
  },
  manage_offers: {
    key: 'manage_offers',
    nameEn: 'Manage Offers',
    nameAr: 'إدارة العروض',
    description: 'View and moderate offers sent by companies',
  },
  manage_categories: {
    key: 'manage_categories',
    nameEn: 'Manage Categories',
    nameAr: 'إدارة الفئات',
    description: 'Add, edit, or delete service categories and subcategories',
  },
  manage_reviews: {
    key: 'manage_reviews',
    nameEn: 'Manage Reviews',
    nameAr: 'إدارة المراجعات',
    description: 'Moderate company reviews and ratings',
  },
  manage_staff: {
    key: 'manage_staff',
    nameEn: 'Manage Staff',
    nameAr: 'إدارة الموظفين',
    description: 'Manage staff roles, departments, and assignments',
  },
  manage_cms: {
    key: 'manage_cms',
    nameEn: 'Manage CMS',
    nameAr: 'إدارة محتوى الموقع',
    description: 'Edit static pages and content sections',
  },
  manage_feature_flags: {
    key: 'manage_feature_flags',
    nameEn: 'Manage Feature Flags',
    nameAr: 'إدارة ميزات النظام',
    description: 'Toggle system features and maintenance mode',
  },
  manage_messages: {
    key: 'manage_messages',
    nameEn: 'Manage Messages',
    nameAr: 'إدارة الرسائل',
    description: 'View and moderate internal and system messages',
  },
  manage_settings: {
    key: 'manage_settings',
    nameEn: 'Manage Settings',
    nameAr: 'إدارة الإعدادات',
    description: 'Edit global system settings and configurations',
  },
  view_health: {
    key: 'view_health',
    nameEn: 'View System Health',
    nameAr: 'عرض حالة النظام',
    description: 'Access system health monitoring and audit logs',
  },
} as const;

export type AdminPermission = keyof typeof ADMIN_PERMISSIONS;

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: Record<string, boolean> | null | undefined,
  permission: AdminPermission,
  userRole?: string,
  isStaff: boolean = false
): boolean {
  // Super admins always have all permissions
  if (userRole?.toUpperCase() === 'SUPER_ADMIN') return true;
  
  // If user is an ADMIN but has NO staff record (legacy admin),
  // they should have full access until a specific role is assigned.
  // This prevents existing admins from being locked out.
  // Once they are a StaffMember (isStaff === true), they MUST have explicit permissions.
  if (userRole?.toUpperCase() === 'ADMIN' && !isStaff) {
    return true;
  }

  if (!userPermissions) return false;
  return !!userPermissions[permission];
}
