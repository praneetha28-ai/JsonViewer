<?php 
// echo file_get_contents("sampleFiles/tenement.xml");

if($_SERVER["REQUEST_METHOD"] == "POST")
{ 
    if(empty($_FILES))
    {
        $contents = "no files";
        echo $contents;
    }
    else if($_FILES["fileinput"]["type"]=="text/xml")
    {
        $contents = file_get_contents($_FILES["fileinput"]["tmp_name"]);
        echo $contents;
    }
    else 
    {
        $contents = "incorrect file";
        echo $contents;
    }
}

?>