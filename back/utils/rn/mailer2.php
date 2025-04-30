<?php

/*
$headers= "MIME-Version: 1.0\r\n";
		            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
		            $headers .= "Content-type: text/html; charset=windows-1251\r\n";
		            $headers .= "From: info@rieltorov.net\r\n";
		            $headers .= "Content-Transfer-Encoding: 8bit\r\n\r\n";

	if (mail("timalev@mail.ru","От посетителя rieltorov.net","ФИО: tseeeeeeeeeeeeeeeeez\n\n",$headers))
	{
		// print "<div id=\"wind\" style=\"width:300px; left: 6%; top: 200px;\"><font color=gray><b>Спасибо!<br><br> Ваш заказ нами получен, мы постараемся ответить в ближайшее время!</b></font><br></div><script>setTimeout('closepop()', 4000);</script>";

		print "<div  style='margin-left: 16px;' ><br><font color=green><b>Спасибо!<br>Ваше письмо получено, постараемся ответить в ближайшее время!</b></font><br><br><br></div>";

	}

*/

//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

class Mailer
{

    //Create an instance; passing `true` enables exceptions
    public $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer;
        try {
            //Server settings
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output

			$this->mail->DebugOutput = 'error_log';
			$this->mail->SMTPDebug = 2; 

            $this->mail->isSMTP();                                            //Send using SMTP
            $this->mail->Host       = 'ssl://smtp.yandex.ru';                     //Set the SMTP server to send through
            $this->mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $this->mail->Username   = 't1malevlev@yandex.ru';                     //SMTP username
            $this->mail->Password   = 'ucbkedlnttwavbzu';                               //SMTP password
           // $this->mail->SMTPSecure = 'ssl';            //Enable implicit TLS encryption
            $this->mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
            $this->mail->CharSet = 'UTF-8';
            //Recipients
            $this->mail->From = 't1malevlev@yandex.ru';
            $this->mail->FromName = 'Агрофима Цветочная Долина';
            
			$this->mail->addAddress('timalev@mail.ru');
            // $mail->addCC('cc@example.com');
            // $mail->addBCC('bcc@example.com');

            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

            //Content
            $this->mail->isHTML(true);                                  //Set email format to HTML
            $this->mail->Subject = 'Here is the subject';
            $this->mail->Body    = 'This is the HTML message body <b>in bold!</b>';
            $this->mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
			
			$this->mail->send();

			echo "ok";


        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$this->mail->ErrorInfo}";
        }
    }
}

 $mailer = new Mailer();

//$mailer->send();