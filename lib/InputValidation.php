<?php

/*
 *
 * @Class Name:InputValidation
 * @Framework:School On Cloud  4.0
 * @Date Created: 18, August, 2017
 * @Version: 1.0
 * @Contributor: Adeniyi Anthony A <a.anthony@mlisoftinc.com>
 * @link:www.mlisoftinc@gmail.com
 *
 */


class InputValidation
{
    /*
     * ----------------------------------------------------------------
     * Validate form input
     * ----------------------------------------------------------------
     */

    /*
     * Validate form input
     * @param   array    $data
     * @param   array    $exceptionList
     * @param   array    $alias
     * @param   array    $filters
     * @return  array
    */
    public function validateInputs(array $data, array $exceptionList = null, array $alias = null, array $filters = null)
    {
        if ($data == null || $data == "" || !$data || !is_array($data)) {
            return array(
                'status' => false,
                'msg' => 'Invalid data provided',
            );
        }
        $errorList = null;
        foreach ($data as $curData => $value) {
            $exceptCurrent = false;

            if ($value == "") {
                /*
                 * check if this is part of the exception
                 */
                if ($exceptionList !== null) {
                    foreach ($exceptionList as $curExcept) {
                        /*
                         * case insensitive search
                         */
                        if ($curData == $curExcept) {
                            $exceptCurrent = true;
                            break;
                        }
                    }
                }

                if ($exceptCurrent === false) {
                    if ($alias != null && isset($alias[$curData])) {
                        $name = $alias[$curData];
                    } else {
                        $name = $curData;
                    }
                    $errorList[] = array(
                        'name' => $name,
                        'value' => $value,
                    );
                }
            }

            /*
             * finally, lets validate filters if they are passed
             */
            if ($filters != null && isset($filters[$curData])) {
                /*
                 * check the filter validations
                 */
                $curFilter = $filters[$curData];
                /*
                 * go over the filter, and validate each filter
                 * parameter provided
                 */
                foreach ($curFilter as $key => $paramValue) {
                    if (!isset($name)) {
                        $name = $curData;
                    }

                    if ($key == "must") {
                        /*
                         * validate must contain the exact value provided
                         * can use regular expression later
                         */
                        if (!preg_match("/" . $paramValue . "/", $value)) {
                            $msg = "value must contain $paramValue";
                            $errorList[] = array(
                                'name' => $name,
                                'value' => $value,
                                'msg' => $msg,
                            );
                        }
                    }
                }
            }

        }

        /*
         * attempt tp build a long error message
         */
        $msg = null;
        if (isset($errorList) && $errorList !== null) {
            $msg = "Invalid input. Ensure all required form field are entered<br>";
            foreach ($errorList as $error) {
                if (isset($error['msg'])) {
                    $msg = $msg . $error['name'] . " " . $error['msg'];
                } else {
                    $msg = $msg . $error['name'] . " cannot be empty<br>";
                }
            }
        }

        /*
         * return complete validation
         */
        if ($errorList === null) {
            return array(
                'status' => true,
                'msg' => 'Success',
                'error' => false,
                'error_list' => $errorList,
                'error_msg' => null,
            );
        } elseif ($errorList !== null) {
            return array(
                'status' => false,
                'msg' => 'Failed',
                'error' => true,
                'error_list' => $errorList,
                'error_msg' => $msg,
            );
        }
    }

}
