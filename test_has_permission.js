const fs = require('fs');

function hasPermission(
  userPermissions,
  permission,
  userRole,
  isStaff = false
) {
  let log = `Checking: role='${userRole}', isStaff=${isStaff}, permission='${permission}'\n`;
  
  if (userRole?.toUpperCase() === 'SUPER_ADMIN') return { result: true, log };
  
  if (userRole?.toUpperCase() === 'ADMIN' && !isStaff) {
    return { result: true, log };
  }

  if (!userPermissions) return { result: false, log: log + '  No permissions object\n' };
  
  // Handle array vs object for curious cases
  const res = !!userPermissions[permission];
  return { result: res, log: log + `  Check value for key '${permission}': ${userPermissions[permission]} -> ${res}\n` };
}

let finalOutput = '';

function test(userPermissions, permission, userRole, isStaff, caseName) {
  const { result, log } = hasPermission(userPermissions, permission, userRole, isStaff);
  finalOutput += `--- Case: ${caseName} ---\n${log}Result: ${result}\n\n`;
}

test({}, 'view_dashboard', 'SUPER_ADMIN', false, 'Owner (SUPER_ADMIN, no staff)');
test({}, 'view_dashboard', 'ADMIN', false, 'Tester (ADMIN, no staff)');
test({}, 'view_dashboard', 'ADMIN', true, 'Admin with record (StaffMember, but no perms set)');
test([], 'view_dashboard', 'ADMIN', true, 'Admin with array record (Prisma empty JSON)');
test([], 'manage_users', 'USER', true, 'Employee (USER role)');

fs.writeFileSync('test_results_utf8.txt', finalOutput, 'utf8');
console.log('Results written to test_results_utf8.txt');
