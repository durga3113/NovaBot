    const getContact = async (jid, nova) => {
    const contact = await nova.contactDB.get(jid);
    const username = contact?.name ?? 'User';
    return { username, jid };
    };
    const saveContacts = async (contacts, nova) => {
    await Promise.all(
    contacts.map(async (contact) => {
    if (contact.id) {
    await nova.contactDB.set(contact.id, contact.notify ?? '');
  }}));
  };
  
  module.exports = { saveContacts, getContact, };
