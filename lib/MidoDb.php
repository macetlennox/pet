<?php


class MidoDb
{

    /**
     *This class handles all the database logic in MIDO FRAMEWORK
     */

    /*
     * protected properties
     */
    Protected $connection;
    Protected $host;
    Protected $database;
    Protected $userName;
    Protected $password;
    Protected $connectionProperties;
    Protected $curConnectionProperty;

    /*
     * some public properties
     */
    public $insertId;
    public $deleteId;
    public $errorList;
    public $lastError;

    public function __construct()
    {
        /*
        * attempt to include the setting file
        * do this over a loop 20 times till we can find the file
        */
        if (!$this->connectionProperties || $this->connectionProperties == null) {
            $settingFile = 'settings.php';
            for ($n = 0; $n < 20; $n++) {
                if (file_exists($settingFile)) {
                    $this->connectionProperties = require $settingFile;
                    break;
                } else {
                    $settingFile = "../$settingFile";
                }
            }
            if (isset($this->connectionProperties['default'])) {
                /*
                 * this has multiple connection settings
                 */
                $this->curConnectionProperty = $this->connectionProperties['default'];
            }

            $this->host = $this->curConnectionProperty['server_name'];
            $this->userName = $this->curConnectionProperty['user_name'];
            $this->database = $this->curConnectionProperty['database'];
            $this->password = $this->curConnectionProperty['password'];
        }
    }

    public function createConnectionSettings($connectionName)
    {
        if (isset($this->connectionProperties[$connectionName])) {
            /*
             * switch the connection to the indicated setting
             */
            $this->curConnectionProperty = $this->connectionProperties[$connectionName];

            $this->host = $this->curConnectionProperty['server_name'];
            $this->userName = $this->curConnectionProperty['user_name'];
            $this->database = $this->curConnectionProperty['database'];
            $this->password = $this->curConnectionProperty['password'];

        } else {
            return false;
        }
    }

    function createConnection($connectionType)
    {
        if ($this->connection) {
            return $this->connection;
        }

        if ($connectionType == "PDO") {
            try {
                $this->connection = new PDO(
                    "mysql:host=$this->connectionProperties['server_name'];
                    dbname=" . $this->connectionProperties['database'],
                    $this->connectionProperties['user_name'],
                    $this->connectionProperties['password']
                );
                // set the PDO error mode to exception

                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $this->connection;
            } catch (PDOException $e) {
                return null;
            }
        } elseif ($connectionType == "LI") {
            // Create connection
            $this->connection = new mysqli(
                $this->host,
                $this->userName,
                $this->password,
                $this->database
            );
            // Check connection
            if ($this->connection->error) {
                return null;
            } else {
                return $this->connection;
            }
        }

    } // End of create Connection function

    public function isRecordFound($sql)
    {
        $this->connection = $this->createConnection("LI");
        if ($this->connection && $sql) {
            $res = $this->connection->query($sql);
            if (mysqli_fetch_assoc($res)) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function insertRecordWithSql($sql)
    {
        $this->connection = $this->createConnection("LI");
        if ($this->connection && $sql) {
            $res = $this->connection->query($sql);
            if ($res) {
                $this->insertId = $this->connection->insert_id;
                return true;
            } else {
                $this->insertId = null;
                return false;
            }
        }
    }

    public function updateRecordWithSql($sql)
    {
        $this->connection = $this->createConnection("LI");
        if ($this->connection && $sql) {
            $res = $this->connection->query($sql);
            if ($res) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function selectRecordWithSql($sql)
    {
        $this->connection = $this->createConnection("LI");
        if ($this->connection && $sql) {
            //var_dump($sql);
            try {
                $res = $this->connection->query($sql);
                if ($res !== false && $res !== null) {
                    if (mysqli_num_rows($res)) {
                        return $res;
                    } else {
                        return null;
                    }
                }

            } catch (Exception $e) {
                //var_dump($e);
                return null;
            }
        }
    }

    /*
     * Delete records using sql
     * @param   string   $sql,
     * @return  bool
    */
    public function deleteRecordWithSql($sql)
    {
        $this->connection = $this->createConnection("LI");
        if ($this->connection && $sql) {
            $res = $this->connection->query($sql);
            if ($res) {
                return true;
            } else {
                return false;
            }
        }
    }

    /*
     * Insert table with an associative array
     * @param   string   $tableName
     * @param   bool   $escapeString
     * @param   array   $tableData
     * @return  bool / array
    */
    public function insertRecordWithArray($tableData, $escapeString = true)
    {
        if (!$tableData || !is_array($tableData)) {
            $this->lastError = "invalid parameters";
            return false;
        }

        /*
         * get all supporting data
         */
        if (!isset($tableData['name']) || !isset($tableData['data'])) {
            return false;
        }

        $fieldList = null;
        $valueList = null;
        /*
         * pick up the table scheme
         */
        if (!$this->connection) {
            $this->connection = $this->createConnection("LI");
        }
        $tableName = $tableData['name'];
        $tableSchema = $this->getTableSchema($tableName);
        if ($tableSchema == false) {
            /*
             * invalid table
             */
            $this->lastError = "Invalid table name";
            return false;
        }

        /*
         * loop over an assign to table
         */
        foreach ($tableSchema as $fieldSchema) {

            $field = $fieldSchema->name;

            /*
             * always skip the ID field
             */
            if ($field == 'id') {
                goto next;
            }
            if ((!isset($tableData['skip'][$field]) || $tableData['skip'][$field] == false)) {

                /*
                 * while getting values, check if there are field mappings in the parameters provided
                 * if there is a mapping, map the db field to the corresponding value in the data provided
                 */
                if (isset($tableData['map'][$field])) {
                    $valueMap = $tableData['map'][$field];
                    $value = isset($tableData['data'][$valueMap]) ? $tableData['data'][$valueMap] : null;
                } else {
                    /*
                     * use default inner mapping of database field names
                     */
                    $value = isset($tableData['data'][$field]) ? $tableData['data'][$field] : null;
                }

                //var_dump($value);

                $curType = isset($tableData['type'][$field]) ? $tableData['type'][$field] : null;

                /*
                 * attempt to escape any special character in the value
                 */
                if ($escapeString === true) {
                    $value = $this->escapeString($value, $curType);
                }

                if ($curType == 'int' || $curType == 'double' || $curType == 'float') {
                    /*
                     * integer format, if value is empty, make 0
                     */
                    if ($value == "") {
                        $value = 0;
                    }
                    if ($valueList == null) {
                        $valueList = "$value";
                        $fieldList = "`$field`";

                    } else {
                        $valueList = $valueList . ",$value";
                        $fieldList = $fieldList . ",`$field`";
                    }
                } else {
                    /*
                     * string format
                     */
                    if ($valueList == null) {
                        $valueList = "'$value'";
                        $fieldList = "`$field`";
                    } else {
                        $valueList = $valueList . ",'$value'";
                        $fieldList = $fieldList . ",`$field`";
                    }
                }
            }
            next:
        }

        /*
         * build the complete insert sql
        */

        $insertSql = "INSERT INTO $tableName ($fieldList) VALUES ($valueList)";
        $insertRes = $this->insertRecordWithSql($insertSql);
        //var_dump($insertSql);
        if ($insertRes == false) {
            $this->lastError = "Could not insert data. Please check error list";
            $this->errorList = $this->connection->error_list;
            return false;
        } else {
            return true;
        }
    }

    /*
     * update table with an associative array
     * @param   array   $tableData
     * @param   bool   $escapeString    def: true
     * @return  bool / array
    */
    public function updateRecordWithArray($tableData, $escapeString = true)
    {
        if (!$tableData || !is_array($tableData)) {
            $this->lastError = "invalid parameters";
            return false;
        }

        /*
         * get all supporting data
         */
        if (!isset($tableData['name']) || !isset($tableData['data'])) {
            return false;
        }

        $fieldList = null;
        $valueList = null;
        /*
         * pick up the table scheme
         */
        if (!$this->connection) {
            $this->connection = $this->createConnection("LI");
        }
        $tableName = $tableData['name'];
        $tableSchema = $this->getTableSchema($tableName);
        if ($tableSchema == false) {
            /*
             * invalid table
             */
            $this->lastError = "Invalid table name";
            return false;
        }

        /*
         * loop over an assign to table
         */
        foreach ($tableSchema as $fieldSchema) {
            //var_dump($fieldSchema);
            //var_dump("<br><br><br>");
            $field = $fieldSchema->name;
            /*
             * always skip the ID field
             */
            if ($field == 'id') {
                goto next;
            }
            if ((!isset($tableData['skip'][$field]) || $tableData['skip'][$field] == false)) {

                /*
                 * while getting values, check if there are field mappings in the parameters provided
                 * if there is a mapping, map the db field to the corresponding value in the data provided
                 */
                if (isset($tableData['map'][$field])) {
                    $valueMap = $tableData['map'][$field];
                    /*
                     * ensure that only provided field are updated
                     */
                    if (!isset($tableData['data'][$valueMap])) {
                        goto next;
                    };
                    $value = $tableData['data'][$valueMap];
                } else {
                    /*
                     * use default inner mapping of database field names
                     * ensure only provided fields are updated
                     */
                    if (!isset($tableData['data'][$field])) {
                        goto next;
                    };
                    $value = $tableData['data'][$field];
                }

                $curType = isset($tableData['type'][$field]) ? $tableData['type'][$field] : null;

                /*
                 * attempt to escape any special character in the value
                 */
                if ($escapeString === true) {
                    $value = $this->escapeString($value, $curType);
                }

                if ($curType == 'int' || $curType == 'double' || $curType == 'float') {
                    /*
                     * integer format, if value is empty, make 0
                     */
                    if ($value == "") {
                        $value = 0;
                    }

                    if ($valueList == null) {
                        $valueList = "`$field`=$value";
                    } else {
                        $valueList = $valueList . ",`$field`=$value";
                    }
                } else {
                    /*
                     * string format
                     */
                    if ($valueList == null) {
                        $valueList = "`$field`='$value'";
                    } else {
                        $valueList = $valueList . ",`$field`='$value'";
                    }
                }
            }
            next:
        }
        $whereClause = null;
        if (isset($tableData['where'])) {
            $whereClause = $tableData['where'];
        }
        /*
         * build the complete update sql
        */
        $updateSql = "UPDATE $tableName SET $valueList WHERE $whereClause";

        //var_dump($updateSql);
        $updateRes = $this->updateRecordWithSql($updateSql);

        if ($updateRes == false) {
            $this->lastError = "Could not update data. Please check error list";
            $this->errorList = $this->connection->error_list;
            return false;
        } else {
            return true;
        }
    }

    /*
     * Fetch Associative array of mysqli_result object
     * @param   mysqli_result   $resultObject
     * @return  array / bool
    */
    public function fetchAssoc($resultObject)
    {
        if (!$resultObject) {
            return false;
        }
        $arrResult = null;
        foreach ($resultObject as $result) {
            $arrResult[] = $result;
        }
        if ($arrResult) {
            return $arrResult;
        } else {
            return false;
        }
    }

    /*
     * Do row count of mysqli_result object
     * @param   mysqli_result   $resultObject
     * @return  int
    */
    public function countRow($resultObject)
    {
        if (!$resultObject) {
            return false;
        }
        $rows = 0;
        foreach ($resultObject as $result) {
            $rows++;
        }
        return $rows;
    }

    /*
     * ------------------------------------------------------------------------
     * PRIVATE FUNCTIONS STARTS HERE
     * ------------------------------------------------------------------------
     */

    /*
     * Get a table schematics
     * @param   string   $tableName
     * @return  array
    */
    private function getTableSchema($tableName)
    {
        $selectSql = "SELECT* FROM $tableName Limit 1";
        if (!$this->connection) {
            $this->createConnection("LI");
        }
        $checkRes = $this->selectRecordWithSql($selectSql);
        if (!$checkRes) {
            /*
             * lets us insert a dummy info and delete at once
             */
            $insertSql = "INSERT INTO $tableName () VALUES ()";
            $insertRes = $this->insertRecordWithSql($insertSql);
            if ($insertRes == true) {
                /*
                 * get the table schematics here
                 */
                $checkRes = $this->selectRecordWithSql($selectSql);
                /*
                 * delete the dummy entry
                 */
                $this->deleteRecordWithSql("DELETE FROM $tableName WHERE id=$this->insertId");
            }
        }

        if ($checkRes) {
            /*
             * attempt to inject
             */
            $checkRes = mysqli_fetch_fields($checkRes);
            return $checkRes;
        } else {
            return null;
        }
    }

    /*
     * use to escape string before inserting in database
     * @param   string   $value
     * @param   string   $valueType
     * @return  string
    */
    private function escapeString($value, $valueType = null)
    {
        if (!$this->connection) {
            $this->connection = $this->createConnection("LI");
        }

        if ($this->connection && $value) {
            if ($valueType !== null) {
                if ($valueType == 'int' || $valueType == 'double' || $valueType == 'float') {
                    $value = str_replace(",", "", $value);
                    //$value=str_replace(".",".",$value);
                }
            }
            return $this->connection->real_escape_string($value);
        } else {
            return $value;
        }
    }

    // END OF CLASS
}