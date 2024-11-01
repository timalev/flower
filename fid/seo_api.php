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
	if (isset($input["url"]) && $input["url"]!="")
	{
		if (CheckUrl($conn, trim($input["url"]),"meta")>0)
			$sql_q = "UPDATE seo_meta SET urls='".trim($input["url"])."', titles='".$input["tit"]."',keywords='".$input["keyw"]."', descriptions='".$input["desc"]."' WHERE urls='".trim($input["url"])."'";
		else
			$sql_q = "INSERT INTO seo_meta (urls,titles,keywords,descriptions) VALUES ('".trim($input["url"])."','".$input["tit"]."','".$input["keyw"]."','".$input["desc"]."')";

			if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}
	if (isset($input["urlh"]) && $input["urlh"]!="")
	{
		//echo "{\"res\": \"".$input["urlh"]."\"}";

		if (CheckUrl($conn, trim($input["urlh"]),"h1")>0)
			$sql_q = "UPDATE seo_h1 SET urls='".trim($input["urlh"])."', h1='".$input["h1"]."' WHERE urls='".trim($input["urlh"])."'";
		else
			$sql_q = "INSERT INTO seo_h1 (urls,h1) VALUES ('".trim($input["urlh"])."','".$input["h1"]."')";

			if (mysqli_query($conn,$sql_q)) echo "{\"res\": \"ok\"}"; else echo "{\"res\": \"er: ".mysqli_error($conn)."\"}";
	}

	$contarr = array();

	if (isset($input["tulp"]) && $input["tulp"]!="")
	{
		$sql_q = "UPDATE seo_cont SET cont='".$input["tulp"]."' WHERE urls='/tulips'";
		if (mysqli_query($conn,$sql_q))

		$contarr[] = "ok";
	}
	if (isset($input["rass"]) && $input["rass"]!="")
	{
		$sql_q = "UPDATE seo_cont SET cont='".$input["rass"]."' WHERE urls='/seedlings'";
		if (mysqli_query($conn,$sql_q))
		$contarr[] = "ok";
	}
	if (count($contarr)>0) echo "{\"res\": \"ok\"}";



	if (isset($input["robo"]) && $input["robo"]!="")
	{
		$sql_q = "UPDATE seo_robo SET robo='".$input["robo"]."' WHERE id=1";
		if (mysqli_query($conn,$sql_q))
		{
			$fp = fopen('/home/flowerwall/flowervalley.ru/docs/robots.txt', 'w');
			if (fwrite($fp, $input["robo"])) echo "{\"res\": \"ok\"}";
			fclose($fp);

		}
	}

	if (isset($input["sitemap"]) && $input["sitemap"]!="")
	{

			$fp = fopen('/home/flowerwall/flowervalley.ru/docs/Sitemap.xml', 'w');
			if (fwrite($fp, $input["sitemap"])) echo "{\"res\": \"ok\"}";
			fclose($fp);


	}


}

if (isset($_GET["grobo"]) && $_GET["grobo"]!="")
{
	$sql_q = "SELECT robo from seo_robo WHERE id=1";
	$sql_res= mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);
	$robo = $rows["robo"];
	echo "{\"res\": \"".urlencode($rows["robo"])."\"}";

}

if (isset($_GET["metas"]) && $_GET["metas"]!="")
{
	$sql_q = "SELECT * FROM seo_meta WHERE urls='".trim($_GET["metas"])."'";
	$sql_res = mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);

	echo "{\"title\": \"".$rows["titles"]."\", \"keywords\": \"".$rows["keywords"]."\", \"descriptions\": \"".$rows["descriptions"]."\"}";
}

if (isset($_GET["h1"]) && $_GET["h1"]!="")
{
	$sql_q = "SELECT * FROM seo_h1 WHERE urls='".trim($_GET["h1"])."'";
	$sql_res = mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);

	echo "{\"h1\": \"".$rows["h1"]."\"}";
}

if (isset($_GET["tscont"]) && $_GET["tscont"]!="")
{
	$sql_q = "SELECT * FROM seo_cont WHERE urls='".$_GET["tscont"]."'";
	$sql_res = mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);

	echo "{\"cont\": \"".trim($rows["cont"])."\"}";
}



function CheckUrl($conn, $url, $pre)
{
	$sql_q = "SELECT COUNT(id) AS 'c' FROM seo_".$pre." WHERE urls='".$url."'";
	$sql_res = mysqli_query($conn,$sql_q);
	$rows = mysqli_fetch_array($sql_res);
	return $rows['c'];
}
?>
