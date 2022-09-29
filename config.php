<?php
class Banco
{
    private $linhas;
    private $array_dados;
    private $lastId;
    public $pdo;
    public $banco;

    public function __construct()
    {
        try {

            /* HOMOLOGAÇÃO */
            $host = 'localhost';
            $usuario = 'root';
            $senha = '';
            $bd = 'db_contato';

            $this->banco = $bd;
            $this->pdo = new PDO("mysql:dbname=" . $bd . ";host=" . $host, $usuario, $senha);
            $this->pdo->exec("set names utf8");

            // echo "Conexão efetuada";

        } catch (PDOException $e) {
            echo 'Erro, não foi possível conectar ao banco de dados: ' . $e->getMessage();
            die();
        }
    }

    public function query($sql, $var = 0)
    {
        try {
            $query = $this->pdo->query($sql);

            $this->linhas = $query->rowCount();
            if ($var == 0) {
                $this->array_dados = $query->fetchAll();
            } else {
                $this->array_dados = $query->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo 'Erro na Query: ' . $e->getMessage();
        }
    }

    public function result()
    {
        return $this->array_dados;
    }
}
