const messages = {
  'msg_reply': 'Sorry this command is for admin only',
  'owner': '🐊 This command is for my owner only',
  'allowed': '😮 Youre not allowed to use that command',
  'not_admin': '🤔 Youre not an admin sorry youre not allowed',
  'novaBot': '😄 The NovaBot must be admin first',
  'success_down': '🙂 Successfull Downloaded',
  'group_close': '😉 Group has been closed by admin',
  'group_open': '👀 Group has been opened by admin',
  'another_bites': '🐼 Another bite dust has left',
  'permission_required': '⛔️ This feature requires a higher permission level',
  'invalid_input': '❌ Invalid input. Please try again.',
  'try_later': '⏳ Please try again later.',
  'not_found': '🔍 Not found.',
  'connection_error': '🔌 Connection error. Please check your internet connection.',
  'unauthorized': '🔒 Unauthorized access.',
  'internal_error': '🛠 Internal server error.',
  'timeout_error': '⏰ Timeout error. Please try again later.',
  'generic_error': '⚠️ An error occurred. Please try again later.',
  'upgrade_required': '🔧 Upgrade required. Please update the bot',
};

function getMessage(key) {
  return messages[key] || 'Message not found';
}

module.exports = {
  messages,
  getMessage
};
