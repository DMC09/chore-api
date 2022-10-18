const QUERY = {
    // SELECT_ITEMS_FROM_ALL_STORES: 
    SELECT_ITEMS_FROM_STORE: 'SELECT * FROM ?? ORDER BY added_at ASC LIMIT 100',
    SELECT_ITEM_FROM_STORE:'SELECT * from ?? WHERE item_id=?',
    ADD_ITEMS_TO_STORE: 'INSERT INTO ?? (item_name,item_quantity,item_notes,added_at,image_url) VALUES (?,?,?,UNIX_TIMESTAMP(),?)',
    UPDATE_ITEMS_FROM_STORE: 'UPDATE ?? SET item_name = ?,item_quantity = ?,item_notes = ? , image_url = ? WHERE item_id = ?',
    DELETE_ITEMS_FROM_STORE: 'DELETE FROM ?? WHERE item_id = ?',
    CREATE_NEW_STORE: 'CREATE TABLE ?? () '
}

export default QUERY