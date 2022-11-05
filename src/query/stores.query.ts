const QUERY = {
    MASTER : {
     CREATE_STORE: "INSERT INTO ?? (table_name,last_updated,created_at,image_url) VALUES (?,UNIX_TIMESTAMP(),?,?)",
     GET_STORES: "SELECT * FROM ??",
     UPDATE_STORE: "UPDATE ?? SET table_item_count = ?, last_updated = UNIX_TIMESTAMP() WHERE table_id = ?",
     DELETE_STORE: "DELETE FROM ?? where table_id = ?",
    },
  STORE:{
    GET_ITEMS: "SELECT * FROM ?? ORDER BY added_at ASC LIMIT 100",
    GET_ITEM: "SELECT * from ?? WHERE item_id=?",
    CREATE:"CREATE TABLE ?? (item_id int unsigned NOT NULL AUTO_INCREMENT,item_name varchar(50) DEFAULT NULL,item_quantity int DEFAULT NULL,item_notes varchar(300) DEFAULT NULL,added_a int DEFAULT NULL,image_url varchar(300) DEFAULT NULL,PRIMARY KEY (`item_id`))",
    ADD_ITEMS:
      "INSERT INTO ?? (item_name,item_quantity,item_notes,added_at,image_url) VALUES (?,?,?,UNIX_TIMESTAMP(),?)",
    UPDATE_ITEMS:
      "UPDATE ?? SET item_name = ?,item_quantity = ?,item_notes = ? , image_url = ? WHERE item_id = ?",
    DELETE_ITEMS: "DELETE FROM ?? WHERE item_id = ?",
    DELETE: "DROP TABLE IF EXISTS stores.??",
  }  
};





export default QUERY;
