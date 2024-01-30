// Define user types constants
const userTypes = {
  customer: "CUSTOMER",
  engineer: "ENGINEER",
  admin: "ADMIN"
};

// Define user status constants
const userStatus = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED"
};

const ticketStatus = {
  open : "OPEN",
  inprogress : "IN_PROGRESS",
  blocked : "BLOCKED",
  closed : "CLOSED"
 }

// Export user types , user status and ticketStatus
module.exports = {
  userTypes,
  userStatus,
  ticketStatus
};