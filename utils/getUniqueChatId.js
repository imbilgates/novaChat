export const getUniqueChatId = (user, chatWithWho) => {
    const sortedUids = [user, chatWithWho].sort();
    return sortedUids.join('');
};