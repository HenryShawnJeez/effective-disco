class Util {
  // Generate a unique user ID
  generateUserId(firstName, nickname) {
    // Use the first letter of the first name
    const firstNameInitial = firstName.charAt(0).toUpperCase();

    // Ensure nickname is safe and lowercase
    const safeNickname = nickname.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Generate a random alphanumeric string
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    // Combine parts to create a unique user ID
    const userId = `${safeNickname}-${firstNameInitial}-${randomString}`;
    return userId;
  }
}

module.exports = new Util();
