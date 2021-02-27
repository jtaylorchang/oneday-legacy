<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Origin');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}

header('Content-type:application/json;charset=utf-8');

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//TODO: MUST ALSO INSERT SETTINGS TO TOP

$sql_settings = "SELECT * FROM settings WHERE hook LIKE 'SETTINGS'";
$result_settings = mysqli_query($connect, $sql_settings);

if (mysqli_num_rows($result_settings) > 0) {

    $settingsVersion;
    $settingsReq;
    $settingsMandatory;
    $settingsLunch1;
    $settingsLunch2;
    $settingsLunch3;
    $settingsLunch4;
    $settingsTimeRegularR;
    $settingsTimeRegularWithAPR;
    $settingsTimeLateStartR;
    $settingsTimeEarlyReleaseWithAPR;
    $settingsTimeEarlyReleaseWithoutAPR;
    $settingsTimeEarlyReleaseAllWithoutAPR;

    $arrayClasses;
    $arrayClassesF;
    $arrayTimeRegularR;
    $arrayTimeRegularWithAPR;
    $arrayTimeLateStartR;
    $arrayTimeEarlyReleaseWithAPR;
    $arrayTimeEarlyReleaseWithoutAPR;
    $arrayTimeEarlyReleaseAllWithoutAPR;

    while ($row_settings = $result_settings->fetch_assoc()) {
        $settingsVersion = $row_settings["version"];
        $settingsReq = $row_settings["req"];
        $settingsMandatory = $row_settings["mandatory"];
        $settingsLunch1 = $row_settings["lunch1"];
        $settingsLunch2 = $row_settings["lunch2"];
        $settingsLunch3 = $row_settings["lunch3"];
        $settingsLunch4 = $row_settings["lunch4"];
        $settingsTimeRegularR = $row_settings["timeRegularR"];
        $settingsTimeRegularWithAPR = $row_settings["timeRegularWithAPR"];
        $settingsTimeLateStartR = $row_settings["timeLateStartR"];
        $settingsTimeEarlyReleaseWithAPR = $row_settings["timeEarlyReleaseWithAPR"];
        $settingsTimeEarlyReleaseWithoutAPR = $row_settings["timeEarlyReleaseWithoutAPR"];
        $settingsTimeEarlyReleaseAllWithoutAPR = $row_settings["timeEarlyReleaseAllWithoutAPR"];
    }

    $classNamesUsed;

    $lunch1Array = explode("~~", $settingsLunch1);
    foreach ($lunch1Array as $thisClass) {
        if (strlen($thisClass) > 0) {
            $arrayClasses[] = array("name" => $thisClass, "lunch" => "1");
            $classNamesUsed[$thisClass] = array("name" => $thisClass, "lunch" => "1", "used" => 1);
        }
    }
    $lunch2Array = explode("~~", $settingsLunch2);
    foreach ($lunch2Array as $thisClass) {
        if (strlen($thisClass) > 0) {
            $arrayClasses[] = array("name" => $thisClass, "lunch" => "2");
            if ($classNamesUsed[$thisClass]["used"] > 0) {
                $classNamesUsed[$thisClass]["used"] = $classNamesUsed[$thisClass]["used"] + 1;
            } else {
                $classNamesUsed[$thisClass] = array("name" => $thisClass, "lunch" => "2", "used" => 1);
            }
        }
    }
    $lunch3Array = explode("~~", $settingsLunch3);
    foreach ($lunch3Array as $thisClass) {
        if (strlen($thisClass) > 0) {
            $arrayClasses[] = array("name" => $thisClass, "lunch" => "3");
            if ($classNamesUsed[$thisClass] > 0) {
                $classNamesUsed[$thisClass]["used"] = $classNamesUsed[$thisClass]["used"] + 1;
            } else {
                $classNamesUsed[$thisClass] = array("name" => $thisClass, "lunch" => "3", "used" => 1);
            }
        }
    }
    $lunch4Array = explode("~~", $settingsLunch4);
    foreach ($lunch4Array as $thisClass) {
        if (strlen($thisClass) > 0) {
            $arrayClasses[] = array("name" => $thisClass, "lunch" => "4");
            if ($classNamesUsed[$thisClass]["used"] > 0) {
                $classNamesUsed[$thisClass]["used"] = $classNamesUsed[$thisClass]["used"] + 1;
            } else {
                $classNamesUsed[$thisClass] = array("name" => $thisClass, "lunch" => "4", "used" => 1);
            }
        }
    }

    foreach ($classNamesUsed as $thisUsed) {
        if ($thisUsed["used"] == 4) {
            /*if(($key = array_search(array("name" => $thisUsed["name"], "lunch" => "1"), $arrayClasses)) !== false) {
                unset($arrayClasses[$key]);
            }
            if(($key = array_search(array("name" => $thisUsed["name"], "lunch" => "2"), $arrayClasses)) !== false) {
                unset($arrayClasses[$key]);
            }
            if(($key = array_search(array("name" => $thisUsed["name"], "lunch" => "3"), $arrayClasses)) !== false) {
                unset($arrayClasses[$key]);
            }
            if(($key = array_search(array("name" => $thisUsed["name"], "lunch" => "4"), $arrayClasses)) !== false) {
                unset($arrayClasses[$key]);
            }
            $arrayClasses[] = array("name" => $thisUsed["name"], "lunch" => "All");*/
            $arrayClassesF[] = array("name" => $thisUsed["name"], "lunch" => "All");
        } else {
            $arrayClassesF[] = array("name" => $thisUsed["name"], "lunch" => $thisUsed["lunch"]);
        }
    }

    $arrayClassesF[] = array("name" => "none", "lunch" => "Need a Category");

    //~~START-END~~START-END~~
    $timeRegularRArray = explode("~~", $settingsTimeRegularR);
    foreach ($timeRegularRArray as $thisTime) {
        if (strlen($thisTime) > 0) {
            $seTimeArray = explode("-", $thisTime);
            $arrayTimeRegularR[] = array("timeStart" => $seTimeArray[0], "timeEnd" => $seTimeArray[1]);
        }
    }
    $timeRegularWithAPRArray = explode("~~", $settingsTimeRegularWithAPR);
    foreach ($timeRegularWithAPRArray as $thisTime) {
        if (strlen($thisTime) > 0) {
            $seTimeArray = explode("-", $thisTime);
            $arrayTimeRegularWithAPR[] = array("timeStart" => $seTimeArray[0], "timeEnd" => $seTimeArray[1]);
        }
    }
    $timeLateStartRArray = explode("~~", $settingsTimeLateStartR);
    foreach ($timeLateStartRArray as $thisTime) {
        if (strlen($thisTime) > 0) {
            $seTimeArray = explode("-", $thisTime);
            $arrayTimeLateStartR[] = array("timeStart" => $seTimeArray[0], "timeEnd" => $seTimeArray[1]);
        }
    }
    $timeEarlyReleaseWithAPRArray = explode("~~", $settingsTimeEarlyReleaseWithAPR);
    foreach ($timeEarlyReleaseWithAPRArray as $thisTime) {
        if (strlen($thisTime) > 0) {
            $seTimeArray = explode("-", $thisTime);
            $arrayTimeEarlyReleaseWithAPR[] = array("timeStart" => $seTimeArray[0], "timeEnd" => $seTimeArray[1]);
        }
    }
    $timeEarlyReleaseWithoutAPRArray = explode("~~", $settingsTimeEarlyReleaseWithoutAPR);
    foreach ($timeEarlyReleaseWithoutAPRArray as $thisTime) {
        if (strlen($thisTime) > 0) {
            $seTimeArray = explode("-", $thisTime);
            $arrayTimeEarlyReleaseWithoutAPR[] = array("timeStart" => $seTimeArray[0], "timeEnd" => $seTimeArray[1]);
        }
    }
    $timeEarlyReleaseAllWithoutAPRArray = explode("~~", $settingsTimeEarlyReleaseAllWithoutAPR);
    foreach ($timeEarlyReleaseAllWithoutAPRArray as $thisTime) {
        if (strlen($thisTime) > 0) {
            $seTimeArray = explode("-", $thisTime);
            $arrayTimeEarlyReleaseAllWithoutAPR[] = array("timeStart" => $seTimeArray[0], "timeEnd" => $seTimeArray[1]);
        }
    }

    $jsonResponse[] = array("date" => "SETTINGS", "version" => $settingsVersion, "req" => $settingsReq, "mandatory" => $settingsMandatory, "classes" => $arrayClassesF, "timeRegularR" => $arrayTimeRegularR, "timeRegularWithAPR" => $arrayTimeRegularWithAPR, "timeLateStartR" => $arrayTimeLateStartR, "timeEarlyReleaseWithAPR" => $arrayTimeEarlyReleaseWithAPR, "timeEarlyReleaseWithoutAPR" => $arrayTimeEarlyReleaseWithoutAPR, "timeEarlyReleaseAllWithoutAPR" => $arrayTimeEarlyReleaseAllWithoutAPR);

    $sql = "SELECT * FROM schedule";
    //echo($sql);
    $result = mysqli_query($connect, $sql);

    /**
     * TODO
     * [x] - don't use an explode. Instead go through each row.
     * [ ] - make sure time is after the cut off date
     */

    $cutOffPast = strtotime("-2 Weeks");
    $cutOffFuture = strtotime("+3 Weeks");

    if (mysqli_num_rows($result) > 0) {
        while ($row = $result->fetch_assoc()) {
            $thisDateMod = $row['dayDate'];
            $cTime = strtotime($thisDateMod);
            if ($cTime > $cutOffPast && $cTime < $cutOffFuture) {
                $thisType = $row['dayType'];
                $thisLetters = $row['dayLetters'];
                $thisNumber = $row['dayNumber'];
                $thisTimeType = $row['dayTimeType'];
                $thisILunch = $row['dayILunch'];
                $thisTimeP1 = $row['dayTimeP1'];
                $thisTimeP2 = $row['dayTimeP2'];
                $thisTimeP3 = $row['dayTimeP3'];
                $thisTimeP4 = $row['dayTimeP4'];
                $thisTimeP5 = $row['dayTimeP5'];
                $thisTimeP6 = $row['dayTimeP6'];
                $thisTimeP7 = $row['dayTimeP7'];
                $thisTimeP8 = $row['dayTimeP8'];
                $thisAutoEdit = $row['autoEdit'];
                $thisAnchor = $row['anchor'];
                $thisCountNumber = $row['countNumber'];

                if ($thisTimeType == "I") {
                    $jsonResponse[] = array("date" => $thisDateMod, "type" => $thisType, "letters" => $thisLetters, "number" => $thisNumber, "timeType" => $thisTimeType, "iLunch" => $thisILunch, "timeP1" => $thisTimeP1, "timeP2" => $thisTimeP2, "timeP3" => $thisTimeP3, "timeP4" => $thisTimeP4, "timeP5" => $thisTimeP5, "timeP6" => $thisTimeP6, "timeP7" => $thisTimeP7, "timeP8" => $thisTimeP8, "autoEdit" => $thisAutoEdit, "anchor" => $thisAnchor, "countNumber" => $thisCountNumber);
                } else {
                    $jsonResponse[] = array("date" => $thisDateMod, "type" => $thisType, "letters" => $thisLetters, "number" => $thisNumber, "timeType" => $thisTimeType, "iLunch" => "", "timeP1" => "", "timeP2" => "", "timeP3" => "", "timeP4" => "", "timeP5" => "", "timeP6" => "", "timeP7" => "", "timeP8" => "", "autoEdit" => $thisAutoEdit, "anchor" => $thisAnchor, "countNumber" => $thisCountNumber);
                }
            }
        }
    } else {
        //$jsonResponse = array("status" => false, "response" => "dne_error");

    }
} else {
    $jsonResponse = array("status" => false, "response" => "settings_error");
}

echo (json_encode(array("schedule" => $jsonResponse), JSON_PRETTY_PRINT));//str_replace(array('[', ']'), '', htmlspecialchars(json_encode($jsonResponse), ENT_NOQUOTES));
//$connect->close();
