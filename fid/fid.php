<?php
$xml = array();

$xml[] = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";

$host="flowerwall.mysql";
$login="flowerwall_mysql";
$pass="e9givG+k";
$dbname="flowerwall_2023";




		if (!$conn = mysqli_connect($host,$login,$pass,$dbname))
			echo "ERR: Can't connect to mysql server<br>";


	mysqli_query($conn, "SET NAMES utf8");


	$sql_q = "SELECT * FROM Product LIMIT 0,3";
	$sql_res = mysqli_query($conn,$sql_q);
	while ($rows = mysqli_fetch_array($sql_res))
  {
   // print $rows["price"];
   // print "<br>";
  }


$xml[] = "<yml_catalog date=\"".date("Y-m-d H:i")."\">\n";
$xml[] = "<shop>\n";
$xml[] = "<name>FlowerValley</name>\n";
$xml[] = "<company>Агрофирма Цветочная Долина</company>\n";
$xml[] = "<url>https://flowervalley.ru/</url>\n";


$xml[] = "<categories>\n";


$sql_q = "SELECT * FROM Category ORDER BY id ASC";
	$sql_res = mysqli_query($conn,$sql_q);
	while ($rows = mysqli_fetch_array($sql_res))
  {
    if ($rows["parentId"]>0)
      $parid = " parentId=\"".$rows["parentId"]."\"";
    else
      $parid = "";

    $xml[] = "<category id=\"".$rows["id"]."\"$parid>".$rows["name"]."</category>\n";
  }

$xml[] = "</categories>\n";

$xml[] = "<offers>\n";

$sql_q = "SELECT * FROM Product ORDER BY id ASC";
	$sql_res = mysqli_query($conn,$sql_q);


	while ($rows = mysqli_fetch_array($sql_res))
  {

    $src = get_record("ProductImage",$rows["id"],"src","productId",$conn);
    $categoryId = get_record("ProductCategory",$rows["id"],"categoryId","productId",$conn);

    if ($src!='' && $categoryId!='')
    {
      $xml[] = "<offer id=\"".str_replace("00~","",$rows["id"])."\">\n";
      $xml[] = "<name>".$rows["name"]."</name>\n";
      $xml[] = "<price>".$rows["price"]."</price>\n";

      $xml[] = "<description><![CDATA[\n".$rows["description"]."\n]]></description>\n";
      $xml[] = "<categoryId>".$categoryId."</categoryId>\n";
      $xml[] = "<currencyId>RUB</currencyId>\n";

      $xml[] = "<picture>".$src."</picture>\n";
      $xml[] = "</offer>\n";
    }
  }

$xml[] = "</offers>\n";




$xml[] = "</shop>\n";
$xml[] = "</yml_catalog>\n";




if (!$fp = fopen("fid.xml", 'w')) {
         echo "Cannot open file";
         exit;
}

    // Write $somecontent to our opened file.
if (fwrite($fp, implode($xml)) === FALSE) {
        echo "Cannot write to file ($filename)";
        exit;
}

echo "Success, wrote  to file";



function get_record($table,$id,$object,$value,$connection)
	{

		$sql_q="SELECT * FROM $table WHERE ".$value."='".$id."'";
		if (!$sql_res=mysqli_query($connection,$sql_q))print "ERR: ".mysqli_error($connection);

		if (mysqli_num_rows($sql_res)>0){

		$rows=mysqli_fetch_array($sql_res);
		$func_res=$rows[$object];
		return $func_res;
		}else
		{
			return "";
		}
	}
?>
