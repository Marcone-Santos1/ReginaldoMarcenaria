<?php

require_once(__DIR__ . "./config.php");

$nome = $_POST['nome'];
$telefone = $_POST['telefone'];
$email = $_POST['email'];
$descricao = $_POST['descricao'];

$bd = new Banco();

$sql = "INSERT INTO tb_contato (nome_cliente, telefone_cliente, email_cliente, descricao) VALUES ('" . $nome . "', '" . $telefone . "', '" . $email . "', '" . $descricao . "')";

$bd->query($sql);

header("location:index.php");

require_once("./email.php");
$assunto = "Olha o SPAM!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
email2($email, $nome, $assunto, $descricao);
