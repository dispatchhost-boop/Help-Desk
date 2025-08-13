// Utility functions for role management
const roleUtils = {
    // Parse the description field (which contains roles array)
    parseRoles: (description) => {
      try {
        return description ? JSON.parse(description) : [];
      } catch (e) {
        return [];
      }
    },
  
    stringifyRoles: (description) => {
        try {
          return description.length>0 ? JSON.stringify(description) : JSON.stringify([]);
        } catch (e) {
          return JSON.stringify([]);
        }
      },
    // Add a role if it doesn't exist
    addRole: (currentRoles, newRole) => {
      if (!currentRoles.includes(newRole)) {
        return [...currentRoles, newRole];
      }
      return currentRoles;
    },
  
    // Remove a specific role
    removeRole: (currentRoles, roleToRemove) => {
      return currentRoles.filter(role => role !== roleToRemove);
    }
  };

  module.exports = roleUtils