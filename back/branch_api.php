<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');



$host="flowerwall.mysql";
$login="flowerwall_mysql";
$pass="e9givG+k";
$dbname="flowerwall_2023";




		if (!$conn = mysqli_connect($host,$login,$pass,$dbname))
			echo "ERR: Can't connect to mysql server<br>";
	 

	mysqli_query($conn, "SET NAMES utf8"); 

//print dirname(__FILE__);

$input = json_decode(file_get_contents('php://input'),true);

if ($input)
{
	if (
		(isset($input["menu1"]) && $input["menu1"]!="") && 
		(isset($input["menu2"]) && $input["menu2"]!="") && 
		(isset($input["menu3"]) && $input["menu3"]!="")
		)
	{
		$sql_q = "INSERT INTO MenuItem (title,link,sort) VALUES ('".trim($input["menu1"])."', '".trim($input["menu2"])."', '".trim($input["menu3"])."')";
		
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}


	if ((isset($input["blc1"]) && $input["blc1"]!="") || (isset($input["blc2"]) && $input["blc2"]!="") || (isset($input["blc3"]) && $input["blc3"]!=""))
	{
		$sql_q = "UPDATE bra_cont_txt SET blc1='".trim($input["blc1"])."', blc2='".trim($input["blc2"])."', blc3='".trim($input["blc3"])."' WHERE id=1";
		
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}

	if (isset($input["item_sort"]) && $input["item_sort"]!="") {

		$sql_q = "UPDATE MenuItem SET sort='".trim($input["item_sort"])."' WHERE id=".trim($input["item_id"]);
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}

	if (isset($input["_sort"]) && $input["_sort"]!="") {

		$sql_q = "UPDATE sort_products SET _sort='".trim($input["_sort"])."' WHERE id=1";
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}

	if (isset($input["item_titl"]) && $input["item_titl"]!="") {

		$sql_q = "UPDATE MenuItem SET title='".trim($input["item_titl"])."' WHERE id=".trim($input["item_id"]);
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}

	if (isset($input["item_link"]) && $input["item_link"]!="") {

		$sql_q = "UPDATE MenuItem SET link='".trim($input["item_link"])."' WHERE id=".trim($input["item_id"]);
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}
	if (isset($input["item_delete"]) && $input["item_delete"]!="") {
		$sql_q = "DELETE FROM MenuItem WHERE id=".trim($input["item_delete"]);
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}


	if (isset($input["video_delete"]) && $input["video_delete"]!="") {
		$sql_q = "DELETE FROM ".trim($input["type"])." WHERE id=".trim($input["video_delete"]);
		if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}
}

if (isset($_FILES["thumbnail"]) && $_FILES["thumbnail"]["tmp_name"]!="")
{
	$name = $_FILES["thumbnail"]["name"];
	$ext = @end((explode(".", $name))); # extra
	$newfilename = $_GET["type"].time().".".$ext;

	if (copy($_FILES["thumbnail"]["tmp_name"], "Uploads/".$newfilename))
	{

		if ($_GET["type"]=="image") {
			$tab = "bra_cont";
		}else 
			$tab = "bra_cont_vid";
		

		$sql_q = "INSERT INTO $tab (_img, _text, _type) VALUES ('".$newfilename."','".$name."','".$_GET["type"]."')";

		//$sql_q = "UPDATE bra_cont SET _img='".$newfilename."' WHERE id=".$_GET["id"];

		//echo "{\"res\": \"".$_GET["id"]."\"}";

		
		if (mysqli_query($conn,$sql_q)) 
		{
			echo "{\"res\": \"".$newfilename."\"}";

		}else echo "{\"res\": \"err: mysql\"}";


	}else
	{
		echo "{\"res\": \"err\"}";

	}
	
}
/*

if (isset($_GET["act"]) && $_GET["act"]=="sort")
{
	echo "{\"res\": \"".$input["video_sort"]."\"}";
	//echo $input["video_sort"];
	//if () {
	//}
}
*/

if (isset($_GET["cont"]) && $_GET["cont"]!="")
{
/*
	$sql_q = "SELECT * FROM  bra_cont WHERE id='".trim($_GET["cont"])."'";
	$sql_res = mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);
	echo "{\"img\": \"".$rows["_img"]."\", \"text\": \"".$rows["_text"]."\", \"vid\": \"".$rows["_vid"]."\"}";

	*/
	$cont = array();

	$sql_q = "SELECT * FROM ".trim($_GET["cont"])." ORDER BY _sort ASC";
	$sql_res = mysqli_query($conn,$sql_q);
	while ($rows = mysqli_fetch_array($sql_res))
	{
		$cont[] = "{\"id\": \"".$rows["id"]."\", \"img\": \"".$rows["_img"]."\", \"text\": \"".$rows["_text"]."\", \"vid\": \"".$rows["_vid"]."\", \"mediaType\": \"".$rows["_type"]."\" , \"sort\": \"".$rows["_sort"]."\"}";
	}

	echo "[".implode(",",$cont)."]";
	
}

if (isset($_GET["menuItems"]) && $_GET["menuItems"]!="")
{
	$cont = array();

	$sql_q = "SELECT * FROM MenuItem ORDER BY sort ASC";
	$sql_res = mysqli_query($conn,$sql_q);
	while ($rows = mysqli_fetch_array($sql_res))
	{
		$cont[] = "{\"id\": \"".$rows["id"]."\", \"title\": \"".$rows["title"]."\", \"link\": \"".$rows["link"]."\", \"sort\": \"".$rows["sort"]."\"}";
	}

	echo "[".implode(",",$cont)."]";	
}


if (isset($_GET["sortItems"]) && $_GET["sortItems"]!="")
{
	$cont = array();

	$sql_q = "SELECT * FROM sort_products WHERE id=1";
	$sql_res = mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);
	

	echo "{\"_sort\" : \"".$rows["_sort"]."\"}";	
}



if (isset($_GET["blocks"]) && $_GET["blocks"]!="")
{
	$sql_q = "SELECT * FROM bra_cont_txt WHERE id=1";
	$sql_res= mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);
	// $robo = $rows["robo"];
	echo "[{\"blc1\": ".json_encode($rows["blc1"])." , \"blc2\": ".json_encode($rows["blc2"]).", \"blc3\": ".json_encode($rows["blc3"])."}]";

}


?>