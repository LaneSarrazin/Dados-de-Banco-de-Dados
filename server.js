// Importar as dependências
const express = require('express');
//const mysql2 = require('mysql2');
const mysql = require('mysql2');
const cors = require('cors');
//const html2pdf = require('html2pdf.js');
//const html2pdfcanvas = require('html2canvas');
//const jsPDF = require('jspdf');
//const { options } = require('pdfkit');
const PDFDocument = require('pdfkit');
const fs = require('fs');
//const { default: html2canvas } = require('html2canvas');
//const jsPDF = require('jspdf');



// Criar a instância do servidor Express
const app = express();
const PORT = 3000;

// Configurar o CORS para todas as rotas
app.use(cors());

// Configurar a conexão com o banco MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Altere para o endereço do seu servidor MySQL, se necessário
    user: 'root',
    password: '@2023tceam',
    database: 'projeto',
  });
// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados!');
  }
});


// Definir a rota para obter os dados do banco de dados
  app.get('/dados', (req, res) => {
    const sqlQuery = 'SELECT * FROM Cliente';

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).json({ error: 'Erro ao obter os dados.' });
    } else {
        console.log('Dados do banco de dados:', results);

        if(req.query.download == 'true'){
          gerarPDF(results,res);
        }else{
          res.json(results);
        }
       
     };
    });
  });


  function gerarPDF(dados, res){
    const doc = new PDFDocument();

    doc.on('error', (err) => {
      console.error('erro', err);
      res.status(500).json({error: "erro"})
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=meu_bd.pdf');

    doc.pipe(res);

    doc.fontSize(18).text('Dados do banco de dados:', {align: 'center'});
    doc.moveDown();

    dados.forEach(item => {
      doc.text(JSON.stringify(item));
      doc.moveDown();

     
    });
      doc.end();
  
  }
  /*function gerarPDF(dados){
    const doc = new PDFDocument();

    const stream = fs.createWriteStream('meu_bd.pdf');

    doc.pipe(stream);

    doc.fontSize(18).text('Dados do banco de dados:', {align: 'center'});
    doc.moveDown();

    dados.forEach(item => {
      doc.text(JSON.stringify(item));
      doc.moveDown();
    });


    doc.end();

    stream.on('finish', () => {
      console.log('PDF gerado');
    });

  }*/




// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

