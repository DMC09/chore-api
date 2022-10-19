const QUERY = {
  // SELECT_ITEMS_FROM_ALL_STORES:
  SELECT_ITEMS_FROM_STORE: "SELECT * FROM ?? ORDER BY added_at ASC LIMIT 100",
  SELECT_ITEM_FROM_STORE: "SELECT * from ?? WHERE item_id=?",
  ADD_ITEMS_TO_STORE:
    "INSERT INTO ?? (item_name,item_quantity,item_notes,added_at,image_url) VALUES (?,?,?,UNIX_TIMESTAMP(),?)",
  UPDATE_ITEMS_FROM_STORE:
    "UPDATE ?? SET item_name = ?,item_quantity = ?,item_notes = ? , image_url = ? WHERE item_id = ?",
  DELETE_ITEMS_FROM_STORE: "DELETE FROM ?? WHERE item_id = ?",
  DELETE_STORE: "DROP TABLE IF EXISTS stores.??",
  CREATE_STORE:
    "CREATE TABLE ?? (item_id int unsigned NOT NULL AUTO_INCREMENT,item_name varchar(50) DEFAULT NULL,item_quantity int DEFAULT NULL,item_notes varchar(300) DEFAULT NULL,added_a int DEFAULT NULL,image_url varchar(300) DEFAULT NULL,PRIMARY KEY (`item_id`))",
};

export default QUERY;
