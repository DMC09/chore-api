const QUERY = {
    // SELECT_ITEMS_FROM_ALL_STORES: 
    SELECT_ITEMS_FROM_STORE: 'SELECT * FROM general_store ORDER BY added_at DESC LIMIT 100',
    INSERT_ITEMS_INTO_STORE: 'INSERT INTO ?? (item_name,item_quantity,item_notes,date_added,item_image_url) VALUES (?,?,?,?,?,?)',
    UPDATE_ITEMS_FROM_STORE: 'UPDATE ?? SET item_name,item_quantity,item_notes,date_added,item_image_url WHERE item_id = ?',
    DELETE_ITEMS_FROM_STORE: 'DELETE FROM ?? WHERE item_id = ?',
    CREATE_NEW_STORE: 'CREATE TABLE ?? () '
}

export default QUERY