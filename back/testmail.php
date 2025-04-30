<?php


require_once './models/mail2.php';



 try {

	 $request = array("test"=>"123");
	 $files = array();

        $mes = new AdminNotification2();
        $mes->send($request, $files);
       // $response->getBody()->write(json_encode('Сообщение отправлено'));
        //return $response;

		print "ok";
    } catch (Exception $e) {

		print "error";
        //$response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка отправки сообщения")));
        //return $response->withStatus(500);
    }




?>