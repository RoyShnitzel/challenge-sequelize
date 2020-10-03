// UPDATE users SET deleted_at=CURRENT_TIME() WHERE deleted_at IS NULL AND id = ?
// UPDATE users SET deleted_at=? WHERE ${id ? `id =${id}` : `deleted_at IS Not Null`}`

module.exports = (deleted_at, id) => {
    return `UPDATE users SET deleted_at=${deleted_at} WHERE ${id ? `id =${id}` : `deleted_at IS Not Null`}`
}